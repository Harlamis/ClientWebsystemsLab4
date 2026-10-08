export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export type SortField = "name" | "dateOfBirth" | null;
export type SortOrder = "asc" | "desc";
