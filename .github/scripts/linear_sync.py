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
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"::error::Linear API {e.code}: {e.read().decode()}")
        raise SystemExit(1)
    if "errors" in data:
        print(f"::error::GraphQL errors: {json.dumps(data['errors'])}")
        raise SystemExit(1)
    return data["data"]


# Fetch all workflow states and filter locally — avoids relying on filter schema
states_data = gql("{ workflowStates { nodes { id name team { key } } } }")
done_state = next(
    (s for s in states_data["workflowStates"]["nodes"]
     if s["name"] == TARGET_STATE and s["team"]["key"] == TEAM_KEY),
    None,
)
if not done_state:
    print(f"::error::State '{TARGET_STATE}' not found for team {TEAM_KEY}")
    raise SystemExit(1)

done_state_id = done_state["id"]

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
