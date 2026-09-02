#!/usr/bin/env bash
set -euo pipefail

readonly THEME="Ava Night"
VERSION="1.3.0"
FILES=("package.json" "themes/ava-night.json" "themes/ava-night-base.json")

log() {
  local level="$1"
  shift
  printf '[%s] %s\n' "$level" "$*"
}

if [[ -f "${FILES[0]}" ]]; then
  count=$(printf '%s\n' "${FILES[@]}" | wc -l)
  log INFO "${THEME} ${VERSION}: checking ${count} files"
else
  log ERROR "package.json not found"
  exit 1
fi

for file in "${FILES[@]}"; do
  [[ -r "$file" ]] && log OK "$file" || log WARN "$file is unavailable"
done

printf 'theme=%s\n' "$(printf '%s' "$THEME" | tr '[:upper:]' '[:lower:]')"