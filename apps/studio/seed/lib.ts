export type SanityDoc = { _id: string; _type: string; [key: string]: any };

export const ref = (id: string) => ({ _type: "reference", _ref: id });

/** Adds stable `_key`s to array members (required by Sanity for arrays of objects). */
export function keyed<T extends object>(items: T[]): (T & { _key: string })[] {
  return items.map((item, i) => ({ _key: `k${i}`, ...item }));
}

/** Removes undefined values so the NDJSON only contains set fields. */
export function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
