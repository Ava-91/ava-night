# Ava Night syntax test samples

This file is a compact manual fixture for the theme's broad syntax coverage. Open each fenced block in a file using the indicated language in the VS Code Extension Development Host with **Ava Night** enabled.

## TypeScript

```ts
interface User { readonly id: number; name: string }
class UserService { async getUser(id: number): Promise<User | null> { const user = await fetchUser(id); if (!user) throw new Error("Not found"); return user } }
const users: User[] = [];
```

## TSX / React

```tsx
interface Props { name: string }
export function Greeting({ name }: Props) { return <button onClick={() => console.log(`Hello ${name}`)}>Hello {name}</button> }
```

## JavaScript / JSX

```js
const pattern = /ava\s+night/gi;
export default function App() { return <main className="app">Hello</main>; }
```

## HTML

```html
<!doctype html>
<html lang="en"><body><button id="save" disabled>Save</button></body></html>
```

## CSS

```css
:root { --night-bg: #0f1117; --accent: #61afef; }
.app:hover { color: var(--accent); transition: opacity 160ms ease; }
```

## JSON

```json
{ "name": "ava-night", "version": "1.1.0", "enabled": true, "items": [1, 2, 3], "nullable": null }
```

## Python

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str

def greet(user: User) -> str:
    return f"Hello {user.name}"
```

## PHP

```php
<?php
final class UserService {
    public function greet(string $name): string { return "Hello $name"; }
}
```

## C#

```csharp
public sealed record User(int Id, string Name);
public async Task<User?> GetUserAsync(int id) => await repository.FindAsync(id);
```

## Java

```java
public final class UserService {
    public User getUser(int id) { return repository.find(id).orElse(null); }
}
```

## Markdown

```md
# Ava Night
**Bold**, *italic*, `inline code`, [link](https://example.com)
```

## YAML

```yaml
name: ava-night
version: 1.1.0
features:
  - semantic-tokens
  - midnight-surfaces
enabled: true
```

## SQL

```sql
SELECT id, name FROM users WHERE active = TRUE ORDER BY name ASC;
```
