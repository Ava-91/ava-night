# Accessibility

Ava Night aims to stay comfortable for long coding sessions without making important states hard to see.

## Core text contrast

The main editor text uses `#D8DEE9` on `#131722`, which provides strong contrast.

Muted UI text uses `#8B95A7` instead of the older `#5D6778`. This keeps secondary text readable while still making it visually quieter.

## Semantic colors

Semantic colors are reserved for meaning:

- Blue: functions and primary interactive syntax
- Purple: keywords and language structure
- Gold: types, classes, and warnings
- Green: strings and added/success states
- Cyan: special syntax and events
- Red: errors and invalid syntax
- Neutral: variables, properties, parameters, and operators

Variables and properties intentionally stay neutral so that important syntax does not become visually noisy.

## State visibility

Important states use more than a single subtle color difference where possible:

- Active controls use borders and backgrounds.
- Errors and warnings use both visible foreground colors and UI state styling.
- Git changes use distinct added, modified, deleted, and conflict colors.
- Selections use a dedicated background so selected text remains obvious.

## Validation

The core palette was checked against the editor backgrounds. The primary text and semantic accents meet strong contrast levels for normal text; muted text was raised to improve readability in dim environments.

Accessibility should still be tested in VS Code at different brightness levels, displays, zoom settings, and with user-installed extensions because third-party UI and semantic tokens can affect the final appearance.
