"""Create a Linear issue from the CLI.

Usage:
    python3 .github/scripts/linear_create.py --title "Title" [--description "..."] [--priority 3]

Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low
Requires LINEAR_API_KEY in env or .env.local.
"""

import argparse
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

LINEAR_API = "https://api.linear.app/graphql"
TEAM_KEY = "THA"
DEFAULT_PROJECT = "Study Group"
DEFAULT_ASSIGNEE = "marconte@thatmuch.fr"


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


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Linear issue")
    parser.add_argument("--title", required=True, help="Issue title")
    parser.add_argument("--description", default=None, help="Issue description (markdown)")
    parser.add_argument("--priority", type=int, default=0, choices=range(5),
                        metavar="{0-4}", help="0=none 1=urgent 2=high 3=medium 4=low")
    args = parser.parse_args()

    api_key = load_api_key()

    bootstrap = gql(api_key, """
    {
      teams { nodes { id key } }
      projects { nodes { id name } }
      users { nodes { id email } }
    }
    """)

    team = next((t for t in bootstrap["teams"]["nodes"] if t["key"] == TEAM_KEY), None)
    if not team:
        raise SystemExit(f"Team '{TEAM_KEY}' not found in Linear")

    project = next((p for p in bootstrap["projects"]["nodes"] if p["name"] == DEFAULT_PROJECT), None)
    if not project:
        raise SystemExit(f"Project '{DEFAULT_PROJECT}' not found in Linear")

    assignee = next((u for u in bootstrap["users"]["nodes"] if u["email"] == DEFAULT_ASSIGNEE), None)
    if not assignee:
        raise SystemExit(f"User '{DEFAULT_ASSIGNEE}' not found in Linear")

    result = gql(
        api_key,
        """mutation(
          $teamId: String!, $title: String!, $description: String,
          $priority: Int, $projectId: String!, $assigneeId: String!
        ) {
          issueCreate(input: {
            teamId: $teamId, title: $title,
            description: $description, priority: $priority,
            projectId: $projectId, assigneeId: $assigneeId
          }) {
            success
            issue { identifier url }
          }
        }""",
        {
            "teamId": team["id"],
            "title": args.title,
            "description": args.description,
            "priority": args.priority,
            "projectId": project["id"],
            "assigneeId": assignee["id"],
        },
    )

    if not result["issueCreate"]["success"]:
        raise SystemExit("issueCreate returned success=false")

    issue = result["issueCreate"]["issue"]
    print(f"Created {issue['identifier']}: {issue['url']}")


if __name__ == "__main__":
    main()
