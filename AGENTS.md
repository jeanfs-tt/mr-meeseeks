# Mr. Meeseeks — Project Guidelines

> "I'm Mr. Meeseeks! Look at me!" - Every helper function in this project follows these rules. No exceptions.

## Code Style

- **Language**: TypeScript.
- **Module system**: ES Modules (`import`/`export`). No CommonJS.
- **Formatting**: Use default Prettier settings (no config file needed).

## Architecture

This is a **helper functions library**. Each helper is a pure, standalone function.

```
src/helpers/
├── index.ts                        # Barrel export - re-exports every helper
└── <functionName>/
    ├── <functionName>.ts            # The helper function
    ├── <functionName>.test.ts       # Tests
    ├── constants.ts  # Constants (if needed)
    └── types.ts      # Types (if needed)
```

### Rules

1. **One function per folder.** Each helper lives in its own folder named after the function.
2. **Named exports only.** No default exports.
3. **Barrel export.** Every helper must be re-exported from `src/helpers/index.ts`.
4. **Co-located tests.** Every `<name>.ts` must have a `<name>.test.ts` in the same folder.
5. **Co-located constants and types.** If a helper needs constants or types, create `constants.ts` and/or `types.ts` in the same folder.

## Naming Conventions

- **Functions**: `camelCase`, verb-prefixed. Use one of: `format`, `get`, `is`, `has`, `to`, `parse`, `create`, `validate`, `slugify`, `truncate`, `debounce`, `throttle`, `clamp`, `group`, `sort`, `filter`, `map`, `merge`, `deep`, `capitalize`, `sanitize`.
- **Folders**: Same as function name. `clampNumber/`, not `clamp-number/` or `clamp/`.
- **Files**: Same as function name. `clampNumber.ts`, not `clamp-number.ts` or `clamp.ts`.
- **Test files**: `<functionName>.test.ts`.
- **Constants files**: `constants.ts`. Export individual `const` values using `UPPER_SNAKE_CASE`.
- **Types files**: `types.ts`. Export types/interfaces using `PascalCase` with a descriptive name (e.g., `ClampNumberOptions`).

## JSDoc Requirements

Every exported function MUST have a JSDoc block with ALL of these tags:

```ts
/**
 * @description Clear one-line summary of what the function does.
 *
 * @param {type} paramName - Description of the parameter.
 * @returns {type} Description of the return value.
 *
 * @example
 * functionName('input');
 * // => 'output'
 */
```

**Mandatory tags**: `@description`, `@param` (one per parameter), `@returns`, `@example` (at least 2), `@throws`, `@since`.

## Input Validation

Every function MUST validate all parameters at the top of the function body, BEFORE any logic:

```ts
export function clampNumber(value: number, min: number, max: number): number {
  if (value === undefined || value === null) {
    throw new TypeError('[clampNumber] Expected value to be provided');
  }

  // ... actual logic
}
```

### Validation rules

- Check **every** parameter for `null` and `undefined`.
- Throw `TypeError` (not `Error`).
- Error message format: `[functionName] Expected paramName to be <condition>`.
- For optional params: only validate if provided (not `undefined`).

## Purity

- No side effects (no console.log, no DOM, no network, no file I/O).
- Never mutate input parameters. Create new values.
- Functions must be deterministic: same input always produces same output.

## Testing Requirements

Every helper MUST have a `.test.ts` file in the same folder using Vitest with this structure:

```ts
import { describe, it, expect } from 'vitest';
import { functionName } from './functionName';

describe('functionName', () => {
  it('describes what happens with normal input', () => { ... });

  it('handles empty string', () => { ... });
  it('handles zero', () => { ... });

  it('throws TypeError for invalid input type', () => {
    expect(() => functionName(123)).toThrow(TypeError);
    expect(() => functionName(123)).toThrow('[functionName]');
  });
});
```

### Test requirements

- Use `describe` / `it` (not `test`).
- One top-level `describe` block per test file, named after the function.
- Error case tests must verify both the error type (`TypeError`) and the message prefix (`[functionName]`).
- At least 3 happy path tests, 3 edge case tests, and 2 error case tests.

## Documentation

Each helper should have a VitePress doc page at `docs/helpers/<kebab-case-name>.md` with:

1. A `# functionName` heading
2. A one-line description
3. A `## Signature` section with the TypeScript signature in a code block
4. A `## Parameters` table
5. A `## Returns` section
6. A `## Examples` section with code blocks
7. A `## Throws` section

## Demo Sandbox

When generating helpers during a demo, place output files in `sandbox/`:
- `sandbox/<functionName>.ts` — the function
- `sandbox/<functionName>.test.ts` — the tests
