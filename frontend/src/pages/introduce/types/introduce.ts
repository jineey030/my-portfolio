export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  features: string[];
  role: string;
  challenges: string[];
  technicalHighlights: {
    title: string;
    description: string;
  }[];
  github?: string;
  demo?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}
