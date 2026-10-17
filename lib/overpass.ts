/**
 * Overpass helpers for "references from a geographic area".
 *
 * Security posture:
 *  - The Overpass QL query is assembled only from validated numbers and from
 *    tag keys/values drawn from a fixed allowlist. User text never reaches
 *    the query string, so there is no QL injection surface.
 *  - Endpoints are restricted to an allowlist of public Overpass mirrors.
 *    Anything else (including http://, file://, localhost, private ranges)
 *    is rejected before a request is made, which closes the SSRF path.
 *  - Responses are capped in size and the request has a timeout.
 *  - The parser keeps only the fields the salience scorer needs and
 *    sanitises names, so a hostile OSM tag cannot inject markup into a route
 *    card.
 */

export const OVERPASS_ENDPOINTS: readonly string[] = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

export const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;
export const DEFAULT_TIMEOUT_MS = 25_000;
export const MAX_RADIUS_M = 400;
export const MIN_RADIUS_M = 10;

/** OSM tag keys that count as potential landmarks. Values are not filtered here; categories are weighted in landmark-salience.ts. */
export const LANDMARK_KEYS: readonly string[] = [
  "amenity", "shop", "tourism", "historic", "leisure", "building", "man_made", "natural", "public_transport", "railway", "place_of_worship",
];

export interface BBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface Point {
  lat: number;
  lon: number;
}

export interface OsmLandmark {
  id: string;
  name: string;
  key: string;
  value: string;
  lat: number;
  lon: number;
}

function assertFiniteNumber(n: unknown, label: string): asserts n is number {
  if (typeof n !== "number" || !Number.isFinite(n)) throw new RangeError(label + " must be a finite number");
}

export function assertPoint(p: Point): void {
  assertFiniteNumber(p.lat, "lat");
  assertFiniteNumber(p.lon, "lon");
  if (p.lat < -90 || p.lat > 90) throw new RangeError("lat out of range");
  if (p.lon < -180 || p.lon > 180) throw new RangeError("lon out of range");
}

export function assertBBox(b: BBox): void {
  assertPoint({ lat: b.south, lon: b.west });
  assertPoint({ lat: b.north, lon: b.east });
  if (b.south >= b.north) throw new RangeError("bbox south must be less than north");
  if (b.west >= b.east) throw new RangeError("bbox west must be less than east");
  // About 0.05 degrees is roughly 5 km at mid latitudes. Larger areas are a
  // denial-of-service risk for the public mirrors and useless for walking
  // routes, so they are refused.
  if (b.north - b.south > 0.05 || b.east - b.west > 0.05) throw new RangeError("bbox too large (max 0.05 degrees per side)");
}

/** Numbers are rendered with fixed precision so no formatting trick can smuggle characters into the query. */
function num(n: number): string {
  return n.toFixed(6);
}

/** Build a query for named landmark features within radius metres of a point. */
export function buildAroundQuery(center: Point, radiusM: number, keys: readonly string[] = LANDMARK_KEYS): string {
  assertPoint(center);
  assertFiniteNumber(radiusM, "radius");
  if (radiusM < MIN_RADIUS_M || radiusM > MAX_RADIUS_M) throw new RangeError("radius must be between " + MIN_RADIUS_M + " and " + MAX_RADIUS_M + " metres");
  const safeKeys = keys.filter((k) => LANDMARK_KEYS.includes(k));
  if (safeKeys.length === 0) throw new RangeError("no allowed landmark keys requested");
  const clauses = safeKeys
    .map((k) => "  nwr[\"" + k + "\"][\"name\"](around:" + Math.round(radiusM) + "," + num(center.lat) + "," + num(center.lon) + ");")
    .join("\n");
  return "[out:json][timeout:20];\n(\n" + clauses + "\n);\nout center tags 200;";
}

/** Build a query for named landmark features inside a bounding box. */
export function buildBBoxQuery(bbox: BBox, keys: readonly string[] = LANDMARK_KEYS): string {
  assertBBox(bbox);
  const safeKeys = keys.filter((k) => LANDMARK_KEYS.includes(k));
  if (safeKeys.length === 0) throw new RangeError("no allowed landmark keys requested");
  const box = num(bbox.south) + "," + num(bbox.west) + "," + num(bbox.north) + "," + num(bbox.east);
  const clauses = safeKeys.map((k) => "  nwr[\"" + k + "\"][\"name\"](" + box + ");").join("\n");
  return "[out:json][timeout:20];\n(\n" + clauses + "\n);\nout center tags 500;";
}

export function assertAllowedEndpoint(url: string): void {
  if (!OVERPASS_ENDPOINTS.includes(url)) {
    throw new RangeError("endpoint not in OVERPASS_ENDPOINTS allowlist");
  }
}

function sanitizeName(name: unknown): string {
  if (typeof name !== "string") return "";
  return name.replace(/[\u0000-\u001f\u007f<>`{}\[\]]/g, "").trim().slice(0, 120);
}

/**
 * Parse an Overpass JSON response into landmarks. Tolerates garbage; never
 * throws on element shape. When `locale` is given, a `name:<locale>` tag is
 * preferred over `name` so French and Spanish users see local-language names.
 */
export function parseOverpassResponse(json: unknown, locale?: "en" | "fr" | "es"): OsmLandmark[] {
  const out: OsmLandmark[] = [];
  if (!json || typeof json !== "object") return out;
  const elements = (json as { elements?: unknown }).elements;
  if (!Array.isArray(elements)) return out;
  for (const el of elements.slice(0, 2000)) {
    if (!el || typeof el !== "object") continue;
    const e = el as Record<string, unknown>;
    const tags = (e.tags && typeof e.tags === "object" ? e.tags : {}) as Record<string, unknown>;
    const localized = locale ? sanitizeName(tags["name:" + locale]) : "";
    const name = localized || sanitizeName(tags.name);
    if (!name) continue;
    let lat: unknown = e.lat;
    let lon: unknown = e.lon;
    if (typeof lat !== "number" && e.center && typeof e.center === "object") {
      lat = (e.center as Record<string, unknown>).lat;
      lon = (e.center as Record<string, unknown>).lon;
    }
    if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const key = LANDMARK_KEYS.find((k) => typeof tags[k] === "string");
    if (!key) continue;
    const value = String(tags[key]).replace(/[^a-z0-9_:-]/gi, "").slice(0, 60);
    const type = typeof e.type === "string" ? e.type.replace(/[^a-z]/g, "") : "x";
    const id = typeof e.id === "number" ? type + "/" + Math.trunc(e.id) : type + "/0";
    out.push({ id, name, key, value, lat, lon });
  }
  return out;
}

/**
 * Fetch landmarks. Uses global fetch (Node 18+). Callers in environments
 * without network (Ollama or Codex samples) should call buildAroundQuery and
 * run it elsewhere, then parseOverpassResponse on the result.
 */
export async function fetchLandmarks(
  query: string,
  endpoint: string = OVERPASS_ENDPOINTS[0],
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<OsmLandmark[]> {
  assertAllowedEndpoint(endpoint);
  if (typeof query !== "string" || query.length > 10_000) throw new RangeError("query too large");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "topographical-disorientation-support-skill/0.1 (landmark lookup)" },
      body: "data=" + encodeURIComponent(query),
      signal: ctrl.signal,
      redirect: "error",
    });
    if (!res.ok) throw new Error("Overpass HTTP " + res.status);
    const len = Number(res.headers.get("content-length") ?? "0");
    if (len > MAX_RESPONSE_BYTES) throw new RangeError("response exceeds MAX_RESPONSE_BYTES");
    const text = await res.text();
    if (text.length > MAX_RESPONSE_BYTES) throw new RangeError("response exceeds MAX_RESPONSE_BYTES");
    return parseOverpassResponse(JSON.parse(text));
  } finally {
    clearTimeout(timer);
  }
}
