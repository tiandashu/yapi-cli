#!/usr/bin/env python3
import argparse
import json
import subprocess
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="Wrapper around the repo's YApi CLI skill entrypoints")
    subparsers = parser.add_subparsers(dest="command", required=True)

    discover = subparsers.add_parser("discover", help="Search interfaces and return a shortlist")
    discover.add_argument("keyword")
    discover.add_argument("--project", help="Project ID or comma-separated project IDs")
    discover.add_argument("--limit", default="8")

    inspect = subparsers.add_parser("inspect", help="Inspect one interface")
    inspect.add_argument("id_or_path")
    inspect.add_argument("--project", help="Single project ID")
    inspect.add_argument("--full", action="store_true")

    list_cmd = subparsers.add_parser("list", help="List interfaces grouped by category")
    list_cmd.add_argument("--project", help="Project ID or comma-separated project IDs")
    list_cmd.add_argument("--category")

    types_cmd = subparsers.add_parser("types", help="Generate TypeScript types")
    types_cmd.add_argument("id_or_path")
    types_cmd.add_argument("--project", help="Single project ID")
    types_cmd.add_argument("--name")

    mock_cmd = subparsers.add_parser("mock", help="Generate mock response data")
    mock_cmd.add_argument("id_or_path")
    mock_cmd.add_argument("--project", help="Single project ID")

    args = parser.parse_args()
    repo_root = Path(__file__).resolve().parents[3]

    if args.command == "list":
      command = build_cli_command(repo_root, "cli", "list", project=args.project, category=args.category, json_output=True)
    elif args.command == "discover":
      command = build_cli_command(repo_root, "skill", "discover", args.keyword, project=args.project, limit=args.limit)
    elif args.command == "inspect":
      command = build_cli_command(repo_root, "skill", "inspect", args.id_or_path, project=args.project, full=args.full)
    elif args.command == "types":
      command = build_cli_command(repo_root, "skill", "types", args.id_or_path, project=args.project, name=args.name)
    else:
      command = build_cli_command(repo_root, "skill", "mock", args.id_or_path, project=args.project)

    completed = subprocess.run(command, cwd=repo_root, text=True, capture_output=True)
    if completed.returncode != 0:
        sys.stderr.write(completed.stderr or completed.stdout)
        return completed.returncode

    output = completed.stdout.strip()
    if not output:
        return 0

    try:
        parsed = json.loads(output)
        print(json.dumps(parsed, indent=2, ensure_ascii=False))
    except json.JSONDecodeError:
        print(output)

    return 0


def build_cli_command(repo_root: Path, entrypoint: str, action: str, *values: str, **options: object) -> list[str]:
    if entrypoint == "skill":
        compiled = repo_root / "dist" / "skills" / "index.js"
        source = repo_root / "skills" / "index.ts"
    else:
        compiled = repo_root / "dist" / "cli" / "index.js"
        source = repo_root / "cli" / "index.ts"

    if compiled.exists():
        command = ["node", str(compiled), action]
    else:
        ts_node = repo_root / "node_modules" / "ts-node" / "dist" / "bin.js"
        command = ["node", str(ts_node), str(source), action]

    command.extend(value for value in values if value)

    for key, value in options.items():
        if value in (None, False, ""):
            continue
        flag = f"--{key.replace('_', '-')}"
        command.append(flag)
        if value is not True:
            command.append(str(value))

    return command


if __name__ == "__main__":
    raise SystemExit(main())
