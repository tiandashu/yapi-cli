#!/bin/sh
set -eu

SKILL_NAME="yapi-cli-skill"
AGENT_DIR="${YAPI_AGENT_DIR:-.agents/skills}"
DEFAULT_SKILLS_ZIP_URL="https://raw.githubusercontent.com/tiandashu/yapi-cli/refs/heads/master/dist/yapi-skills.zip"

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

extract_zip() {
  _archive="$1"
  _dest="$2"
  if need_cmd unzip; then
    unzip -q "$_archive" -d "$_dest"
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
  need_cmd curl || err "curl is required."
  need_cmd unzip || err "unzip is required."

  install_root="${INIT_CWD:-$PWD}"
  dest="$(CDPATH= cd -- "$install_root" && pwd -P)/$AGENT_DIR/$SKILL_NAME"
  url="${YAPI_SKILLS_ZIP_URL:-$DEFAULT_SKILLS_ZIP_URL}"

  say "Installing skill to $dest"
  say "Downloading $url"

  tmpzip="$(mktemp)"
  tmpdir="$(mktemp -d)"
  trap 'rm -rf "$tmpdir"; rm -f "$tmpzip"' EXIT INT TERM

  curl -fsSL "$url" -o "$tmpzip" || err "Download failed. Check the URL or set YAPI_SKILLS_ZIP_URL."

  say "Extracting archive"
  extract_zip "$tmpzip" "$tmpdir" || err "Cannot extract zip."

  copy_skill "$tmpdir" "$dest"

  trap - EXIT INT TERM
  rm -rf "$tmpdir"
  rm -f "$tmpzip"

  say "Installed: $dest"
}

main "$@"
