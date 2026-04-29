export interface PhaseField {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "number"
    | "date"
    | "file"
    | "content";
  required: boolean;
  options?: string[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  isMandatory?: boolean;
  startDate?: string;
  endDate?: string;
  fields?: PhaseField[];
}

export interface Hackathon {
  id: string;
  title: string;
  tagline: string;
  date: string;
  prize?: string;
  tags: string[];
  banner: string;
  organizer: string;
  organizers?: Array<{
    name: string;
    phone?: string;
    email?: string;
    avatar: string;
    socials: {
      twitter: string;
      linkedin: string;
      github: string;
    };
  }>;
  slots?: number;

  startDate?: string;
  endDate?: string;
  phases: Phase[];
}

export interface HackathonProgress {
  hackathonId: string;
  responses: Record<string, unknown>;
  status: string;
}
