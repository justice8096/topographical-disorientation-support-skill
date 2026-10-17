/**
 * Landmark salience scoring at a decision point.
 *
 * Reimplements the recipe in Graser (2016), "Developing an open pedestrian
 * landmark navigation model" (Walk21): a weighted sum of distance to the
 * decision point, category weight, same-side-as-turn bonus, before/after
 * position, and a visibility proxy. Category weights below are a starting
 * point and are meant to be tuned from user feedback; they are not the
 * original expert rankings.
 *
 * Pure functions, no I/O.
 */

import type { OsmLandmark, Point } from "./overpass.js";

export interface DecisionPoint extends Point {
  /** Bearing of travel when arriving at the point, degrees clockwise from north. */
  approachBearing: number;
  /** Bearing of travel when leaving the point. */
  exitBearing: number;
}

export interface ScoredLandmark extends OsmLandmark {
  distanceM: number;
  side: "left" | "right" | "ahead" | "behind";
  position: "before" | "at" | "after";
  score: number;
}

/** Category weights 0..1. Higher means more recognisable from the street. */
export const CATEGORY_WEIGHTS: Record<string, number> = {
  "amenity:place_of_worship": 1.0,
  "historic:monument": 0.95,
  "tourism:attraction": 0.9,
  "amenity:fuel": 0.9,
  "amenity:pharmacy": 0.85,
  "amenity:bank": 0.8,
  "amenity:post_office": 0.8,
  "amenity:cafe": 0.75,
  "amenity:restaurant": 0.75,
  "amenity:fast_food": 0.75,
  "amenity:school": 0.7,
  "amenity:hospital": 0.9,
  "amenity:police": 0.85,
  "amenity:fire_station": 0.85,
  "amenity:library": 0.75,
  "amenity:theatre": 0.8,
  "amenity:cinema": 0.8,
  "shop:supermarket": 0.85,
  "shop:bakery": 0.7,
  "shop:convenience": 0.6,
  "shop:*": 0.5,
  "leisure:park": 0.8,
  "leisure:playground": 0.6,
  "natural:water": 0.85,
  "natural:tree": 0.3,
  "man_made:tower": 0.9,
  "man_made:bridge": 0.9,
  "building:church": 1.0,
  "building:*": 0.35,
  "public_transport:station": 0.9,
  "public_transport:stop_position": 0.5,
  "railway:station": 0.9,
  "*": 0.4,
};

export const MAX_DISTANCE_M = 120;

export function categoryWeight(key: string, value: string): number {
  return CATEGORY_WEIGHTS[key + ":" + value] ?? CATEGORY_WEIGHTS[key + ":*"] ?? CATEGORY_WEIGHTS["*"];
}

const R = 6_371_000;
function toRad(d: number): number { return (d * Math.PI) / 180; }

export function haversineM(a: Point, b: Point): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Initial bearing from a to b, degrees clockwise from north in [0, 360). */
export function bearingDeg(a: Point, b: Point): number {
  const y = Math.sin(toRad(b.lon - a.lon)) * Math.cos(toRad(b.lat));
  const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lon - a.lon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function relativeAngle(fromBearing: number, toBearing: number): number {
  // Signed angle in (-180, 180]; positive is clockwise (to the right).
  let d = ((toBearing - fromBearing) % 360 + 540) % 360 - 180;
  if (d === -180) d = 180;
  return d;
}

export function sideOf(dp: DecisionPoint, lm: Point): ScoredLandmark["side"] {
  const rel = relativeAngle(dp.approachBearing, bearingDeg(dp, lm));
  if (Math.abs(rel) <= 25) return "ahead";
  if (Math.abs(rel) >= 155) return "behind";
  return rel > 0 ? "right" : "left";
}

/** Which way does the route turn at this point: left, right, or straight. */
export function turnDirection(dp: DecisionPoint): "left" | "right" | "straight" {
  const rel = relativeAngle(dp.approachBearing, dp.exitBearing);
  if (Math.abs(rel) < 20) return "straight";
  return rel > 0 ? "right" : "left";
}

export function scoreLandmark(dp: DecisionPoint, lm: OsmLandmark): ScoredLandmark | null {
  const distanceM = haversineM(dp, lm);
  if (distanceM > MAX_DISTANCE_M) return null;
  const side = sideOf(dp, lm);
  const position: ScoredLandmark["position"] = side === "behind" ? "before" : side === "ahead" ? "after" : "at";
  const turn = turnDirection(dp);

  const distanceScore = 1 - distanceM / MAX_DISTANCE_M; // 0..1
  const catScore = categoryWeight(lm.key, lm.value); // 0..1
  const sideScore = turn === "straight" ? 0.5 : side === turn ? 1 : side === "ahead" ? 0.6 : 0.2;
  const positionScore = position === "at" ? 1 : position === "before" ? 0.7 : 0.4;
  const visibilityScore = distanceM <= 60 ? 1 : 0.5; // proxy, no line-of-sight analysis

  const score = 0.3 * distanceScore + 0.3 * catScore + 0.2 * sideScore + 0.1 * positionScore + 0.1 * visibilityScore;
  return { ...lm, distanceM: Math.round(distanceM), side, position, score: Math.round(score * 1000) / 1000 };
}

/** Rank landmarks for a decision point; returns at most `limit` results, best first. */
export function rankLandmarks(dp: DecisionPoint, landmarks: readonly OsmLandmark[], limit = 3): ScoredLandmark[] {
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw new RangeError("limit must be an integer 1..20");
  const scored: ScoredLandmark[] = [];
  for (const lm of landmarks.slice(0, 5000)) {
    const s = scoreLandmark(dp, lm);
    if (s) scored.push(s);
  }
  scored.sort((a, b) => b.score - a.score || a.distanceM - b.distanceM);
  return scored.slice(0, limit);
}
