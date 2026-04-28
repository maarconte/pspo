import json
import os
import re
import urllib.error
import urllib.request

LINEAR_API = "https://api.linear.app/graphql"
TEAM_KEY = "THA"
TARGET_STATE = "Done"

api_key = os.environ["LINEAR_API_KEY"]
commits = json.loads(os.environ.get("COMMITS_JSON", "[]"))

messages = " ".join(c.get("message", "") for c in commits)
tickets = sorted(set(re.findall(rf"{TEAM_KEY}-\d+", messages)))

if not tickets:
    print("No Linear tickets found in this push")
    raise SystemExit(0)

print(f"Tickets found: {', '.join(tickets)}")


def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        LINEAR_API,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
    if "errors" in data:
        raise RuntimeError(data["errors"])
    return data["data"]


# Fetch Done state ID by navigating team → states (workflowStates doesn't support team filter)
team_data = gql(
    'query($key: String!, $name: String!) { teams(filter: {key: {eq: $key}}) { nodes { states(filter: {name: {eq: $name}}) { nodes { id } } } } }',
    {"key": TEAM_KEY, "name": TARGET_STATE},
)
teams = team_data["teams"]["nodes"]
if not teams or not teams[0]["states"]["nodes"]:
    print(f"::error::State '{TARGET_STATE}' not found for team {TEAM_KEY}")
    raise SystemExit(1)

done_state_id = teams[0]["states"]["nodes"][0]["id"]

for ticket in tickets:
    issue_data = gql(
        "query($id: String!) { issues(filter: {identifier: {eq: $id}}) { nodes { id } } }",
        {"id": ticket},
    )
    nodes = issue_data["issues"]["nodes"]
    if not nodes:
        print(f"::warning::Ticket {ticket} not found in Linear, skipping")
        continue

    issue_id = nodes[0]["id"]
    update_data = gql(
        "mutation($id: String!, $stateId: String!) { issueUpdate(id: $id, input: {stateId: $stateId}) { success } }",
        {"id": issue_id, "stateId": done_state_id},
    )
    success = update_data["issueUpdate"]["success"]
    print(f"  {ticket} → {TARGET_STATE}: {'ok' if success else 'failed'}")
