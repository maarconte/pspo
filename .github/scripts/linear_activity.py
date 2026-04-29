"""Post a project update to the Linear 'Study Group' project from a .md file.

Usage:
    python3 .github/scripts/linear_activity.py activity/my-update.md

Frontmatter keys:
    health : onTrack | atRisk | offTrack  (optional)

The file body (below the frontmatter) becomes the update content.
Files prefixed with '_' (e.g. _example.md) are skipped.
"""

import argparse
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

LINEAR_API = "https://api.linear.app/graphql"
DEFAULT_PROJECT = "Study Group"


def load_api_key() -> str:
    if key := os.environ.get("LINEAR_API_KEY"):
        return key
    env_file = Path(__file__).parents[2] / ".env.local"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("LINEAR_API_KEY="):
                return line.split("=", 1)[1].strip().strip("\"'")
    raise SystemExit("LINEAR_API_KEY not found in env or .env.local")


def gql(api_key: str, query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        LINEAR_API,
        data=body,
        headers={"Authorization": api_key, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Linear API {e.code}: {e.read().decode()}")
    if "errors" in data:
        raise SystemExit(f"GraphQL errors: {json.dumps(data['errors'])}")
    return data["data"]


def parse_frontmatter(content: str) -> tuple[dict, str]:
    if not content.startswith("---"):
        return {}, content
    try:
        end = content.index("---", 3)
    except ValueError:
        return {}, content
    body = content[end + 3:].strip()
    fm: dict = {}
    for line in content[3:end].strip().splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            fm[key.strip()] = value.strip().strip("\"'")
    return fm, body


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("file", help="Path to the .md file")
    args = parser.parse_args()

    path = Path(args.file)
    if path.stem.startswith("_"):
        print(f"Skipping {path.name} (prefixed with '_')")
        return

    fm, body = parse_frontmatter(path.read_text(encoding="utf-8"))
    if not body:
        raise SystemExit("Update body cannot be empty")

    api_key = load_api_key()

    projects = gql(api_key, "{ projects { nodes { id name } } }")
    project = next((p for p in projects["projects"]["nodes"] if p["name"] == DEFAULT_PROJECT), None)
    if not project:
        raise SystemExit(f"Project '{DEFAULT_PROJECT}' not found in Linear")

    variables: dict = {"projectId": project["id"], "body": body}
    if health := fm.get("health"):
        variables["health"] = health

    result = gql(
        api_key,
        """mutation($projectId: String!, $body: String!, $health: ProjectUpdateHealthType) {
          projectUpdateCreate(input: {
            projectId: $projectId
            body: $body
            health: $health
          }) {
            success
            projectUpdate { url }
          }
        }""",
        variables,
    )

    if not result["projectUpdateCreate"]["success"]:
        raise SystemExit("projectUpdateCreate returned success=false")
    print(f"Project update posted: {result['projectUpdateCreate']['projectUpdate']['url']}")


if __name__ == "__main__":
    main()
