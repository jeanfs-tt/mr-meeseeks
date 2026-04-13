---
name: create-helper
description: 'Create a new helper function with tests and documentation. Use when: adding a new utility function, creating a helper, building a new helper, writing a utility. Generates the function file, test file, VitePress doc page, and updates the barrel export.'
argument-hint: 'Describe the helper function you want to create (e.g., "a function that truncates text to N characters with ellipsis")'
---

# Create Helper Function

A step-by-step workflow for creating a complete helper function that meets the Mr. Meeseeks quality standard.

## When to Use

- Adding a new utility/helper function to the library
- Creating a function during the demo (place in `sandbox/` instead of `src/helpers/`)

## Procedure

### Step 1: Create the Function File

Create `src/helpers/<functionName>.ts` (or `sandbox/<functionName>.ts` if demoing):

1. Write the full JSDoc block first - this forces you to think about the API before coding.
2. Add all input validation at the top of the function body.
3. Implement the pure logic.
4. Add an explicit return type.

Follow the template in [references/template.md](./references/template.md).

### Step 2: Create the Test File

Create `src/helpers/__tests__/<functionName>.test.ts` (or `sandbox/__tests__/<functionName>.test.ts`):

1. Import from vitest: `describe`, `it`, `expect`.
2. Create only one `describe` block for the whole test file.
3. Create three test blocks: `'happy path'`, `'edge cases'`, `'error cases'`.
4. Write at least 1 happy-path test, 1 edge-case test, and 1 error-case test.
5. Use `@ts-expect-error` before deliberately invalid inputs.
6. Test both the error type (`TypeError`) and message prefix (`[functionName]`).

### Step 3: Update Barrel Export

Add the new export to `src/helpers/index.ts`:

```ts
export { functionName } from './functionName';
```

### Step 4: Create VitePress Documentation

Create `docs/helpers/<kebab-case-name>.md` with:

1. `# functionName` heading
2. One-line description
3. `## Signature` with TypeScript code block
4. `## Parameters` table (Name, Type, Default, Description)
5. `## Returns` description
<!-- 6. `## Examples` with code blocks -->

### Step 5: Verify

Run the quality check:

```bash
npx tsx scripts/score.ts src/helpers/<functionName>.ts
```

The score should be **12/12**. If not, fix the issues identified.

### Step 6: Run Tests

```bash
npx vitest run src/helpers/__tests__/<functionName>.test.ts
```

All tests should pass.
