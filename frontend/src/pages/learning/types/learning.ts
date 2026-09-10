export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface StudyLogData {
  id: number;
  date: string;
  content: string;
}
