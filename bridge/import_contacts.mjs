// Sanitized OutreachAI contact mapping helper.
// This file performs transformation only. It does not connect to a database or write data.

export const VALID_TRADES = new Set([
  "HVAC", "Plumbing", "Electrical", "Construction", "Roofing", "Banks", "Brokers",
  "DAC", "Bank", "Personal Dev", "Restaurants", "Auto Repair", "Trucking",
  "Healthcare", "Landscaping", "Retail"
]);

export function mapTrade(pipeline) {
  const map = {
    HVAC: "HVAC",
    Plumbing: "Plumbing",
    Electrical: "Electrical",
    Construction: "Construction",
    Roofing: "Roofing",
    Bank: "Bank",
    Banks: "Banks",
    DAC: "DAC",
    "Personal Dev": "Personal Dev",
    Restaurants: "Restaurants",
    "Auto Repair": "Auto Repair",
    Trucking: "Trucking",
    Healthcare: "Healthcare",
    Landscaping: "Landscaping",
    Retail: "Retail",
    Brokers: "Brokers"
  };
  return map[pipeline] || null;
}

export function parseCityState(cityStr) {
  if (!cityStr) return { city: null, state: null };
  const parts = cityStr.split(", ");
  if (parts.length >= 2) {
    return { city: parts.slice(0, -1).join(", "), state: parts[parts.length - 1] };
  }
  return { city: cityStr, state: null };
}

export function normalizeContact(contact) {
  const trade = mapTrade(contact?.pipeline);
  if (!trade) return null;

  const score = Number.parseInt(contact?.score, 10) || 85;
  const priority = ["Low", "Medium", "High"].includes(contact?.priority) ? contact.priority : null;
  const ownerName = contact?.ownerName || (contact?.name && contact.name !== contact.company ? contact.name : null);
  const { city, state } = parseCityState(contact?.city);

  return {
    company: contact?.company || "Unknown",
    owner: ownerName || null,
    city: city || null,
    state: state || null,
    trade,
    email: contact?.email || null,
    phone: contact?.phone || null,
    priority,
    score,
    outreachSource: "OutreachAI",
    status: "New Lead"
  };
}
