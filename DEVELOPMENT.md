# Ava Night Development Guide

## Requirements

- Node.js
- npm
- Visual Studio Code
- @vscode/vsce

---

## Install dependencies

```bash
npm install
````

## Run the Extension Development Host

Press **F5**

or use

Run → Start Debugging

---

## Package

```bash
vsce package
```

The generated file will look like:

```
ava-night-x.x.x.vsix
```

---

## Publish

```bash
vsce publish
```

or

```bash
vsce publish patch
```

```bash
vsce publish minor
```

```bash
vsce publish major
```

---

## Project Structure

```
themes/
    Ava Night-color-theme.json
```

---

## Repository

[https://github.com/Ava-91/ava-night](https://github.com/Ava-91/ava-night)

---

## Marketplace

[https://marketplace.visualstudio.com/items?itemName=Ava-91.ava-night](https://marketplace.visualstudio.com/items?itemName=Ava-91.ava-night)

````

---

# 📁 .github/PULL_REQUEST_TEMPLATE.md

```md
## Summary

Describe the changes made.

---

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] UI improvement
- [ ] Theme color adjustment
- [ ] Documentation

---

## Checklist

- [ ] Theme builds successfully
- [ ] JSON is valid
- [ ] README updated (if needed)
- [ ] CHANGELOG updated
- [ ] Screenshots updated (if needed)

---

## Additional Notes

Anything reviewers should know?