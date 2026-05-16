import { LeadPublic } from '../types/lead.types';

// ─── CSV Escape ───────────────────────────────────────────────────────────────

function escapeField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// ─── Headers ──────────────────────────────────────────────────────────────────

const HEADERS = ['ID', 'Name', 'Email', 'Status', 'Source', 'Owner Name', 'Owner Email', 'Created At'];

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateLeadsCSV(leads: LeadPublic[]): string {
  const rows = leads.map((lead) =>
    [
      lead.id,
      escapeField(lead.name),
      escapeField(lead.email),
      lead.status,
      lead.source,
      escapeField(lead.owner.name),
      escapeField(lead.owner.email),
      lead.createdAt.toISOString(),
    ].join(','),
  );

  return [HEADERS.join(','), ...rows].join('\n');
}
