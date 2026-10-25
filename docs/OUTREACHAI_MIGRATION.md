# Fast OutreachAI → Gabriel CRM migration

## Decision

Stop treating OutreachAI as a system that must be deeply integrated before the Gabriel CRM can operate. Use OutreachAI as the migration source and the restored Gabriel Growth Engine as the replacement working CRM.

## Replacement CRM already restored

Branch `crm-rebuild-fast` starts from the previously working Gabriel Growth Engine state. It includes:

- local lead/client database;
- browser localStorage persistence;
- CSV import/export;
- JSON backup/restore;
- prospect search, scoring, pipeline, contact, follow-up, proposal, snapshot, and package tools;
- no auto-sending or production outreach.

## Migration tool

Open `tools/outreachai-import/` from the same browser/origin as the CRM.

The tool:

1. accepts OutreachAI CSV or JSON exports;
2. processes the file locally in the browser;
3. maps common fields including business/company, contact, website, city/state, pipeline, email, phone, status, priority, score, and verification state;
4. preserves OutreachAI ID/status/priority/score as migration metadata;
5. deduplicates first by OutreachAI ID, then email, phone, then business + contact;
6. updates the same `gabriel-growth-engine-v2` browser storage used by the restored CRM;
7. never sends contact data to GitHub.

## Data-safety rule

Do not commit a production OutreachAI export, contact list, names, emails, phones, cookies, tokens, or credentials to this public repository. Migration data stays in the local browser or another explicitly approved private datastore.

## Remaining migration step

Obtain the complete OutreachAI contact export through an authorized user/session path, then feed it into the migration page. The migration should be validated by counts and aggregate field coverage before OutreachAI is retired as the working CRM.

No outreach, merge, deployment, deletion, or production mutation is part of this branch.
