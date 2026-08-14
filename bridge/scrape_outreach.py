"""
Read-only probe of likely OutreachAI contact endpoints.
No credentials, writes, outreach, or private data are embedded here.
"""
import json
import requests

BASE_URL = "https://outreachapp-yywiz6tr.manus.space"

PIPELINES = [
    "HVAC",
    "Bank",
    "DAC",
    "Personal Dev",
    "Plumbing",
    "Electrical",
    "Restaurants",
    "Auto Repair",
    "Trucking",
    "Roofing",
    "Healthcare",
    "Landscaping",
    "Retail",
    "Construction",
]

session = requests.Session()
session.headers.update({
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
})


def try_api_endpoints():
    endpoints_to_try = [
        "/api/contacts",
        "/api/trpc/contacts.list",
        "/api/trpc/contacts.getAll",
        "/api/trpc/contact.list",
        "/api/trpc/lead.list",
        "/api/leads",
        "/api/prospects",
    ]
    for ep in endpoints_to_try:
        try:
            r = session.get(BASE_URL + ep, timeout=10)
            print(f"{ep} -> {r.status_code} ({len(r.text)} bytes)")
            if r.status_code == 200:
                try:
                    return ep, r.json()
                except Exception:
                    pass
        except Exception as exc:
            print(f"{ep} -> ERROR: {exc}")
    return None, None


def try_trpc_batch():
    queries = [
        "contacts.getAll",
        "contacts.list",
        "contact.getAll",
        "contact.list",
        "leads.getAll",
        "leads.list",
        "prospect.getAll",
    ]
    for query in queries:
        try:
            url = f"{BASE_URL}/api/trpc/{query}"
            params = {"input": json.dumps({"json": {"limit": 2000}})}
            r = session.get(url, params=params, timeout=15)
            print(f"tRPC {query} -> {r.status_code}")
            if r.status_code == 200:
                try:
                    return query, r.json()
                except Exception:
                    pass
        except Exception as exc:
            print(f"tRPC {query} -> ERROR: {exc}")
    return None, None


if __name__ == "__main__":
    print("=== Probing OutreachAI API endpoints ===")
    endpoint, data = try_api_endpoints()
    if not endpoint:
        print("=== Trying tRPC endpoints ===")
        endpoint, data = try_trpc_batch()
    if endpoint:
        print(f"Found readable endpoint: {endpoint}")
        print("Response shape only; do not commit private response data.")
        if isinstance(data, dict):
            print("Top-level keys:", list(data.keys()))
        else:
            print("Response type:", type(data).__name__)
    else:
        print("No unauthenticated read endpoint found.")
