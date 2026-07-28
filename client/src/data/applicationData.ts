// Shared application data source — used by both Dashboard and Applications pages
// All stats are derived dynamically from this single array

export type StatusType = 'IN REVIEW' | 'INTERVIEWING' | 'OFFER RECEIVED' | 'WITHDRAWN' | 'APPLIED';

export interface ApplicationRecord {
  id: number | string;
  role: string;
  company: string;
  location: string;
  date: string;
  ago: string;
  status: StatusType;
  match: number;
  logo: string;
  logoBg: string;
}

export const applicationData: ApplicationRecord[] = [
  { id: 1, role: 'Senior Product Designer',  company: 'Stellarize Tech', location: 'San Francisco (Remote)', date: 'Oct 24, 2023', ago: '2 days ago',  status: 'IN REVIEW',      match: 94, logo: 'ST', logoBg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { id: 2, role: 'Lead UI Engineer',          company: 'Nova Capital',    location: 'London, UK',            date: 'Oct 20, 2023', ago: '6 days ago',  status: 'INTERVIEWING',   match: 88, logo: 'NC', logoBg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id: 3, role: 'UX Research Lead',          company: 'Verdant Labs',    location: 'Berlin, DE',            date: 'Oct 18, 2023', ago: '8 days ago',  status: 'OFFER RECEIVED', match: 91, logo: 'VL', logoBg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { id: 4, role: 'Design Systems Architect',  company: 'Aegis Core',      location: 'Singapore',             date: 'Oct 15, 2023', ago: '11 days ago', status: 'WITHDRAWN',      match: 76, logo: 'AC', logoBg: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
  { id: 5, role: 'Product Design Lead',       company: 'Orbit Systems',   location: 'Austin, TX (Remote)',   date: 'Oct 12, 2023', ago: '14 days ago', status: 'IN REVIEW',      match: 89, logo: 'OS', logoBg: 'linear-gradient(135deg,#fda085,#f6d365)' },
  { id: 6, role: 'Senior UX Designer',        company: 'Lumina Corp',     location: 'New York, NY',          date: 'Oct 10, 2023', ago: '16 days ago', status: 'APPLIED',        match: 82, logo: 'LC', logoBg: 'linear-gradient(135deg,#30cfd0,#330867)' },
];

// ── Derived counts (single source of truth) ──────────────────────────────
export const appStats = {
  applied:      applicationData.length,
  shortlisted:  applicationData.filter(a => ['IN REVIEW', 'INTERVIEWING', 'OFFER RECEIVED'].includes(a.status)).length,
  interviews:   applicationData.filter(a => a.status === 'INTERVIEWING').length,
  offers:       applicationData.filter(a => a.status === 'OFFER RECEIVED').length,
  withdrawn:    applicationData.filter(a => a.status === 'WITHDRAWN').length,
  active:       applicationData.filter(a => ['IN REVIEW', 'INTERVIEWING', 'APPLIED'].includes(a.status)).length,
};
