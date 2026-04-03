#!/bin/sh
set -eu

SKILL_NAME="yapi-cli-skill"
AGENT_DIR="${YAPI_AGENT_DIR:-.agents/skills}"
# Published artifact on the default branch (override with YAPI_SKILLS_ZIP_URL)
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

# When invoked as `curl ... | sh`, $0 is sh — walk up from cwd instead of using $0.
find_file_upward() {
  _name="$1"
  _start="$2"
  _d="$(CDPATH= cd -- "$_start" && pwd -P)"
  while [ -n "$_d" ] && [ "$_d" != "/" ]; do
    if [ -f "$_d/$_name" ]; then
      printf '%s' "$_d/$_name"
      return 0
    fi
    _d=$(dirname "$_d")
  done
  return 1
}

find_dir_upward() {
  _name="$1"
  _start="$2"
  _d="$(CDPATH= cd -- "$_start" && pwd -P)"
  while [ -n "$_d" ] && [ "$_d" != "/" ]; do
    if [ -d "$_d/$_name" ]; then
      printf '%s' "$_d/$_name"
      return 0
    fi
    _d=$(dirname "$_d")
  done
  return 1
}

resolve_root_from_script() {
  case "$0" in
    */install-skills.sh)
      _script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
      CDPATH= cd -- "$_script_dir/.." && pwd
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

main() {
  install_root="${INIT_CWD:-$PWD}"
  dest="$(CDPATH= cd -- "$install_root" && pwd -P)/$AGENT_DIR/$SKILL_NAME"

  say "Installing skill to $dest"

  archive=""
  tmpzip=""
  root=""

  if root="$(resolve_root_from_script 2>/dev/null)"; then
    if [ -f "$root/dist/yapi-skills.zip" ]; then
      archive="$root/dist/yapi-skills.zip"
    fi
  fi

  if [ -z "$archive" ]; then
    archive="$(find_file_upward dist/yapi-skills.zip "$install_root" || true)"
  fi

  if [ -z "$archive" ] || [ ! -f "$archive" ]; then
    if need_cmd curl; then
      url="${YAPI_SKILLS_ZIP_URL:-$DEFAULT_SKILLS_ZIP_URL}"
      tmpzip="$(mktemp)"
      say "Downloading skill archive from $url"
      if curl -fsSL "$url" -o "$tmpzip"; then
        archive="$tmpzip"
      else
        rm -f "$tmpzip"
        tmpzip=""
      fi
    fi
  fi

  if [ -n "$archive" ] && [ -f "$archive" ]; then
    tmpdir="$(mktemp -d)"
    if [ -n "$tmpzip" ]; then
      trap 'rm -rf "$tmpdir"; rm -f "$tmpzip"' EXIT INT TERM
    else
      trap 'rm -rf "$tmpdir"' EXIT INT TERM
    fi

    say "Extracting archive"
    extract_zip "$archive" "$tmpdir" || err "Cannot extract archive. Install unzip and retry."
    copy_skill "$tmpdir" "$dest"

    trap - EXIT INT TERM
    rm -rf "$tmpdir"
    [ -n "$tmpzip" ] && rm -f "$tmpzip"

    say "Installed: $dest"
    exit 0
  fi

  src="$(find_dir_upward skills/yapi-cli-skill "$install_root" || true)"
  if [ -n "$src" ] && [ -f "$src/SKILL.md" ]; then
    say "No zip found; using source directory: $src"
    copy_skill "$src" "$dest"
    say "Installed: $dest"
    exit 0
  fi

  err "No install source found. Run from a yapi-cli clone (npm run build), ensure dist/yapi-skills.zip exists upstream, or set YAPI_SKILLS_ZIP_URL."
}

main "$@"
