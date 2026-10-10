# DeshiMart — Fix Cloudflare Pages `UnknownLockfileVersion` Build Error

Resolving the Cloudflare Pages deployment failure (`UnknownLockfileVersion: failed to parse lockfile: 'bun.lock'` on `bun@1.2.15`).

---

## Root Cause
- The local workspace has **Bun 1.4.2**, which writes `bun.lock` with `"lockfileVersion": 2`.
- Cloudflare Pages' build image runs **Bun 1.2.15**, which only understands `"lockfileVersion": 0` or `1` and immediately fails when `bun.lock` is present (`bun install --frozen-lockfile` → `Unknown lockfile version`).
- Cloudflare Pages also detects `nodejs@24.18.0` and uses `npm ci` when a standard `package-lock.json` is present instead of `bun.lock`.

---

## Implementation Steps
1. **Delete `bun.lock` and Ignore Future Bun Lockfiles**:
   - Delete `/bun.lock` from the project root so Cloudflare Pages does not trigger `bun@1.2.15` lockfile parsing.
   - Add `bun.lock` and `bun.lockb` to `.gitignore` so local Bun commands never re-introduce an incompatible lockfile into Git commits.
2. **Generate Standard `package-lock.json` & Set `packageManager` in `package.json`**:
   - Add `"packageManager": "npm@10.9.8"` and `"engines": { "node": ">=20.0.0" }` to `package.json`.
   - Generate a clean `package-lock.json` using `npm install --package-lock-only` so Cloudflare Pages uses Node.js + `npm` cleanly and deterministically without Bun lockfile version errors.
