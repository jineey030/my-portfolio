import './LearningTracker.css';
import { useState } from 'react';
import type {
  Todo,
  StudyLogData
} from './types/learning';
import StudyLog from './components/StudyLog';
import TodoList from './components/TodoList';
import DashboardCard from './components/DashboardCard';

function LearningTracker() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [studyLogs, setStudyLogs] = useState<StudyLogData[]>([])

  const handleTodosChange = (todos: Todo[]) => {
    setTodos(todos);
  };

  const handleStudyLogsChange = (
    studyLogs: StudyLogData[]
  ) => {
    setStudyLogs(studyLogs);
  };

  const completedTodoCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const totalTodoCount = todos.length;
  const studyLogCount = studyLogs.length;
  const studyDays = new Set(
    studyLogs.map((log) => log.date)
  ).size;

  const todoProgress =
    totalTodoCount === 0
      ? 0 : Math.round( (completedTodoCount / totalTodoCount) * 100);

  return (
    <main className="learning-tracker">
      <header className="learning-tracker-header">
        <p className="learning-tracker-label">
          PROJECT / LEARNING TRACKER
        </p>

        <h1>Learning Tracker</h1>

        <p className="learning-tracker-description">
          React와 Kotlin 학습 현황과 Todo를 관리합니다.
        </p>
      </header>

      {/* 학습 현황 */}
      <section className="learning-summary">
        <DashboardCard
          label="TODO"
          value={`${todoProgress}%`}
          description={`${completedTodoCount} / ${totalTodoCount} completed`}
        />

        <DashboardCard
          label="STUDY LOG"
          value={String(studyLogCount)}
          description="learning records"
        />

        <DashboardCard
          label="STUDY DAYS"
          value={String(studyDays)}
          description="unique study days"
        />
      </section>

      <TodoList
        onTodosChange={handleTodosChange}
      />

      <StudyLog
        onStudyLogsChange={handleStudyLogsChange}
      />
    </main>
  );
}

export default LearningTracker;
