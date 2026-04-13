# Helper Function Template

Use this template when creating a new helper function. Replace all placeholders.

## Function File (`src/helpers/<functionName>.ts`)

```ts
/**
 * @description <Clear one-line summary of what the function does.>
 *
 * @param {<type>} <paramName> - <Description of the parameter.>
 * @returns {<type>} <Description of the return value.>
 *
 * @example
 * <functionName>(<input1>);
 * // => <output1>
 *
 * @example
 * <functionName>(<input2>);
 * // => <output2>
 *
 * @throws {TypeError} <When and why this error is thrown.>
 *
 * @since 1.0.0
 */
export function <functionName>(<params>): <returnType> {
  // --- Input validation ---
  if (typeof <param> !== '<expectedType>') {
    throw new TypeError('[<functionName>] Expected <param> to be a <expectedType>');
  }

  // --- Logic ---
  // ... pure implementation, no side effects ...
}
```

## Test File (`src/helpers/<functionName>.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import { <functionName> } from './<functionName>';

describe('<functionName>', () => {
  describe('happy path', () => {
    it('<describes normal behavior 1>', () => {
      expect(<functionName>(<input>)).toBe(<expected>);
    });

    it('<describes normal behavior 2>', () => {
      expect(<functionName>(<input>)).toBe(<expected>);
    });

    it('<describes normal behavior 3>', () => {
      expect(<functionName>(<input>)).toBe(<expected>);
    });
  });

  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(<functionName>('')).toBe(<expected>);
    });

    it('handles zero', () => {
      expect(<functionName>(0)).toBe(<expected>);
    });

    it('<another edge case>', () => {
      expect(<functionName>(<input>)).toBe(<expected>);
    });
  });

  describe('error cases', () => {
    it('throws TypeError for invalid type', () => {
      // @ts-expect-error testing invalid input
      expect(() => <functionName>(<wrongType>)).toThrow(TypeError);
      // @ts-expect-error testing invalid input
      expect(() => <functionName>(<wrongType>)).toThrow('[<functionName>]');
    });

    it('throws TypeError for null', () => {
      // @ts-expect-error testing invalid input
      expect(() => <functionName>(null)).toThrow(TypeError);
    });
  });
});
```

## Documentation Page (`docs/helpers/<kebab-case-name>.md`)

```markdown
# <functionName>

<One-line description.>

## Signature

\`\`\`ts
function <functionName>(<params>): <returnType>
\`\`\`

## Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `<param>` | `<type>` | — | <Description> |

## Returns

`<type>` — <Description of what is returned.>

## Examples

\`\`\`ts
import { <functionName> } from '../src/helpers';

<functionName>(<input>); // <output>
\`\`\`

## Throws

- `TypeError` — <When thrown.>
```
