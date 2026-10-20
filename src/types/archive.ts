export interface ArchiveProgram {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  period: string;
  enabled: boolean;
}

export interface ArchiveEntry {
  id: string;
  slug: string;
  program: string;
  order: number;
  badge: string;
  title: string;
  listTitle: string;
  date: string;
  location: string;
  subtitle: string;
  body: string;
}

export interface ArchiveData {
  programs: ArchiveProgram[];
  entries: ArchiveEntry[];
}
