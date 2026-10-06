export interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl: string | null;
  deployUrl: string | null;
  imageUrl: string | null;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
}