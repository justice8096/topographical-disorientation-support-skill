/**
 * Path containment helper used by the CLI and by anything that loads
 * knowledge markdown by name. A name is accepted only if it is a plain slug
 * and the resolved path stays inside the base directory.
 */
import { resolve, sep } from "path";

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function safeKnowledgePath(baseDir: string, name: string, ext = ".md"): string {
  if (typeof name !== "string" || !SLUG.test(name)) throw new RangeError("invalid knowledge name");
  const base = resolve(baseDir);
  const full = resolve(base, name + ext);
  if (!full.startsWith(base + sep)) throw new RangeError("path escapes base directory");
  return full;
}
