"""
Scrape all contacts from OutreachAI app across all trade pipelines.
Uses requests + BeautifulSoup to hit the contacts API endpoint directly.
"""
import json
import time
import requests

BASE_URL = "https://outreachapp-yywiz6tr.manus.space"

# All pipeline/trade categories visible in the app
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
    """Try common API patterns to find the contacts endpoint."""
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
            print(f"  {ep} → {r.status_code} ({len(r.text)} bytes)")
            if r.status_code == 200:
                try:
                    data = r.json()
                    print(f"    JSON keys: {list(data.keys()) if isinstance(data, dict) else type(data)}")
                    return ep, data
                except Exception:
                    pass
        except Exception as e:
            print(f"  {ep} → ERROR: {e}")
    return None, None

def try_trpc_batch():
    """Try tRPC batch endpoint to get contacts."""
    trpc_queries = [
        "contacts.getAll",
        "contacts.list",
        "contact.getAll",
        "contact.list",
        "leads.getAll",
        "leads.list",
        "prospect.getAll",
    ]
    for query in trpc_queries:
        try:
            url = f"{BASE_URL}/api/trpc/{query}"
            params = {"input": json.dumps({"json": {"limit": 2000}})}
            r = session.get(url, params=params, timeout=15)
            print(f"  tRPC {query} → {r.status_code}")
            if r.status_code == 200:
                try:
                    data = r.json()
                    print(f"    Response: {str(data)[:200]}")
                    return query, data
                except Exception:
                    pass
        except Exception as e:
            print(f"  tRPC {query} → ERROR: {e}")
    return None, None

print("=== Probing OutreachAI API endpoints ===")
ep, data = try_api_endpoints()
if not ep:
    print("\n=== Trying tRPC batch endpoints ===")
    ep, data = try_trpc_batch()

if ep:
    print(f"\n✓ Found working endpoint: {ep}")
    with open("/home/ubuntu/outreach_contacts_raw.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Saved raw data to /home/ubuntu/outreach_contacts_raw.json")
else:
    print("\n✗ No direct API found. Will need to scrape HTML pages.")
