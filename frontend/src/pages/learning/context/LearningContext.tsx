import {
  createContext,
  useContext,
  useMemo,
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

  // Provider가 다시 렌더링될 때마다 새 객체가 만들어지면
  // 이 Context를 쓰는 모든 컴포넌트가 불필요하게 다시 렌더링된다.
  // todos / studyLogs가 실제로 바뀔 때만 새 값을 만든다.
  const value = useMemo(
    () => ({
      todos,
      studyLogs,
      setTodos,
      setStudyLogs
    }),
    [todos, studyLogs]
  );

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
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
