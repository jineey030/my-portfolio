export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  link: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}
