/**
 * Bulk import script: reads all_outreach_contacts.json and inserts into the leads table
 * Run with: node import_contacts.mjs
 */
import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const VALID_TRADES = new Set([
  "HVAC", "Plumbing", "Electrical", "Construction", "Roofing", "Banks", "Brokers",
  "DAC", "Bank", "Personal Dev", "Restaurants", "Auto Repair", "Trucking",
  "Healthcare", "Landscaping", "Retail"
]);

function mapTrade(pipeline) {
  const map = {
    'HVAC': 'HVAC',
    'Plumbing': 'Plumbing',
    'Electrical': 'Electrical',
    'Construction': 'Construction',
    'Roofing': 'Roofing',
    'Bank': 'Bank',
    'Banks': 'Banks',
    'DAC': 'DAC',
    'Personal Dev': 'Personal Dev',
    'Restaurants': 'Restaurants',
    'Auto Repair': 'Auto Repair',
    'Trucking': 'Trucking',
    'Healthcare': 'Healthcare',
    'Landscaping': 'Landscaping',
    'Retail': 'Retail',
    'Brokers': 'Brokers',
  };
  return map[pipeline] || null;
}

function parseCityState(cityStr) {
  if (!cityStr) return { city: null, state: null };
  const parts = cityStr.split(', ');
  if (parts.length >= 2) {
    return { city: parts.slice(0, -1).join(', '), state: parts[parts.length - 1] };
  }
  return { city: cityStr, state: null };
}

async function main() {
  const raw = readFileSync('/home/ubuntu/Downloads/all_outreach_contacts.json', 'utf-8');
  const contacts = JSON.parse(raw);
  console.log(`Loaded ${contacts.length} contacts from OutreachAI`);

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  const [existingRows] = await connection.execute('SELECT email, company FROM leads');
  const existingEmails = new Set(existingRows.map(r => r.email?.toLowerCase()).filter(Boolean));
  const existingCompanies = new Set(existingRows.map(r => r.company?.toLowerCase()).filter(Boolean));
  console.log(`Existing leads in DB: ${existingRows.length}`);

  let imported = 0;
  let skipped = 0;
  let invalid = 0;
  const batchSize = 50;
  const batch = [];

  for (const contact of contacts) {
    const trade = mapTrade(contact.pipeline);
    if (!trade) {
      invalid++;
      continue;
    }

    const emailKey = contact.email?.toLowerCase();
    const companyKey = contact.company?.toLowerCase();

    if ((emailKey && existingEmails.has(emailKey)) || (companyKey && existingCompanies.has(companyKey))) {
      skipped++;
      continue;
    }

    const { city, state } = parseCityState(contact.city);
    const score = parseInt(contact.score) || 85;
    const priority = ['Low', 'Medium', 'High'].includes(contact.priority) ? contact.priority : null;
    const ownerName = contact.ownerName || (contact.name !== contact.company ? contact.name : null);

    batch.push({
      company: contact.company || 'Unknown',
      owner: ownerName || null,
      city: city || null,
      state: state || null,
      trade,
      email: contact.email || null,
      phone: contact.phone || null,
      priority,
      score,
      outreachSource: 'OutreachAI',
      status: 'New Lead',
    });

    if (emailKey) existingEmails.add(emailKey);
    if (companyKey) existingCompanies.add(companyKey);

    if (batch.length >= batchSize) {
      await connection.execute(
        `INSERT INTO leads (company, owner, city, state, trade, email, phone, priority, score, outreachSource, status, createdAt, updatedAt) VALUES ${batch.map(() => '(?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())').join(',')}`,
        batch.flatMap(b => [b.company, b.owner, b.city, b.state, b.trade, b.email, b.phone, b.priority, b.score, b.outreachSource, b.status])
      );
      imported += batch.length;
      batch.length = 0;
      process.stdout.write(`\rImported: ${imported}...`);
    }
  }

  if (batch.length > 0) {
    await connection.execute(
      `INSERT INTO leads (company, owner, city, state, trade, email, phone, priority, score, outreachSource, status, createdAt, updatedAt) VALUES ${batch.map(() => '(?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())').join(',')}`,
      batch.flatMap(b => [b.company, b.owner, b.city, b.state, b.trade, b.email, b.phone, b.priority, b.score, b.outreachSource, b.status])
    );
    imported += batch.length;
  }

  await connection.execute(
    `INSERT INTO activity_feed (type, title, description, createdAt) VALUES (?, ?, ?, NOW())`,
    ['lead_discovered', `Bulk import complete: ${imported} contacts added`, `${skipped} duplicates skipped, ${invalid} invalid. Source: OutreachAI`]
  );

  await connection.end();
  console.log(`\n✓ Import complete: ${imported} imported, ${skipped} skipped (duplicates), ${invalid} invalid (no trade mapping)`);
}

main().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
