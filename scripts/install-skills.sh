#!/bin/sh
set -eu

SKILL_NAME="yapi-cli-skill"
AGENT_DIR="${YAPI_AGENT_DIR:-.agents/skills}"

say() {
  printf '  %s\n' "$@"
}

err() {
  printf '  %s\n' "$@" >&2
  exit 1
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

resolve_root() {
  script_path="$0"
  script_dir="$(CDPATH= cd -- "$(dirname -- "$script_path")" && pwd)"
  CDPATH= cd -- "$script_dir/.." && pwd
}

extract_zip() {
  _archive="$1"
  _dest="$2"
  if need_cmd unzip; then
    unzip -q "$_archive" -d "$_dest"
    return 0
  fi
  if need_cmd tar && tar -xf "$_archive" -C "$_dest" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

copy_skill() {
  _src="$1"
  _dest="$2"

  rm -rf "$_dest"
  mkdir -p "$_dest"
  cp -R "$_src/." "$_dest"
}

main() {
  root="$(resolve_root)"
  install_root="${INIT_CWD:-$PWD}"
  dest="$install_root/$AGENT_DIR/$SKILL_NAME"

  archive="$root/dist/yapi-skills.zip"
  local_src="$root/skills/yapi-cli-skill"

  say "Installing skill to $dest"

  if [ -f "$archive" ]; then
    tmpdir="$(mktemp -d)"
    trap 'rm -rf "$tmpdir"' EXIT INT TERM

    say "Using built archive: $archive"
    extract_zip "$archive" "$tmpdir" || err "Cannot extract $archive. Install unzip and retry."
    copy_skill "$tmpdir" "$dest"
    rm -rf "$tmpdir"
    trap - EXIT INT TERM
  elif [ -d "$local_src" ]; then
    say "Built archive not found. Falling back to source skill directory."
    copy_skill "$local_src" "$dest"
  else
    err "No install source found. Run npm run build first."
  fi

  say "Installed: $dest"
}

main "$@"
