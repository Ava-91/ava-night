# Ava Night Theme Inspector

This tiny local VS Code extension turns syntax-highlighting behavior into machine-readable evidence.

## Run it

1. Open the repository in VS Code.
2. Run **Developer: Install Extension from Location...** and select `tools/theme-inspector`.
3. Run **Ava Night: Inspect Theme** from the Command Palette.
4. Inspect `tests/results/semantic-tokens.json`.

For development, you can also open `tools/theme-inspector` as an Extension Development Host and run the command there.

## What it captures

- Fixture filename and VS Code language ID.
- The semantic-token legend reported by VS Code.
- Semantic token positions and token types for each fixture.
- Token counts and provider errors.

This lets a reviewer answer questions such as "does VS Code classify this identifier as a class, method, parameter, property, or type?" without relying on a screenshot.

## What it does not capture

This is not a pixel renderer. Exact workbench appearance—sidebar spacing, tab layout, terminal rendering, and other purely visual details—still needs visual or automated rendering tests.
