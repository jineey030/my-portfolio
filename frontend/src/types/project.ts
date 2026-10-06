export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  githubUrl: string | null;
  deployUrl: string | null;
  imageUrl: string | null;
  role: string | null;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
}

export interface Challenge {
  id: number;
  name: string;
}

export interface TechnicalHighlight {
  id: number;
  title: string;
  description: string;
}
