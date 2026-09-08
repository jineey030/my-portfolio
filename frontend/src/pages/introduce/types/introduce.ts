export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];

  features: string[];
  role: string;
  challenges: string[];

  github?: string;
  demo?: string;
};

export interface SkillGroup {
  category: string;
  items: string[];
}
