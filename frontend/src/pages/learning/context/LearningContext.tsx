import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react';

import type {
  Todo,
  StudyLogData
} from '../types/learning';

interface LearningContextValue {
  todos: Todo[];
  studyLogs: StudyLogData[];

  setTodos: React.Dispatch<
    React.SetStateAction<Todo[]>
  >;

  setStudyLogs: React.Dispatch<
    React.SetStateAction<StudyLogData[]>
  >;
}

const LearningContext =
  createContext<LearningContextValue | null>(null);

interface LearningProviderProps {
  children: ReactNode;
}

export function LearningProvider({
  children
}: LearningProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [studyLogs, setStudyLogs] =
    useState<StudyLogData[]>([]);

  return (
    <LearningContext.Provider
      value={{
        todos,
        studyLogs,
        setTodos,
        setStudyLogs
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context =
    useContext(LearningContext);

  if (!context) {
    throw new Error(
      'useLearning은 LearningProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
}