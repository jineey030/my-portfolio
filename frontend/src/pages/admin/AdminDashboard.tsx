import { useState } from 'react';
import type {
  Todo,
  StudyLogData
} from '../learning/types/learning';
import DashboardCard from '../learning/components/DashboardCard';

function AdminDashboard() {
  const [todos] = useState<Todo[]>([]);
  const [studyLogs] = useState<StudyLogData[]>([]);

  const completedTodoCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const totalTodoCount = todos.length;
  const studyLogCount = studyLogs.length;

  const studyDays = new Set(
    studyLogs.map((log) => log.date)
  ).size;

  const latestStudyDate =
    studyLogs.length === 0
      ? '-'
      : (
          studyLogs
            .map((log) => log.date)
            .sort()
            .at(-1) ?? '-'
        )
          .slice(0, 10)
          .replace(/-/g, '.');

  const todoProgress =
    totalTodoCount === 0
      ? 0
      : Math.round(
          (completedTodoCount / totalTodoCount) * 100
        );

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="admin-page-label">
          ADMIN / DASHBOARD
        </p>

        <h1>Dashboard</h1>

        <p className="admin-page-description">
          학습 현황을 확인하고 관리합니다.
        </p>
      </header>

      <section className="learning-summary">
        <DashboardCard
          type="todo"
          label="TODO"
          value={`${todoProgress}%`}
          description={`${completedTodoCount} / ${totalTodoCount} completed`}
          progress={todoProgress}
        />

        <DashboardCard
          type="study-log"
          label="STUDY LOG"
          value={String(studyLogCount)}
          description="learning records"
        />

        <DashboardCard
          type="study-days"
          label="STUDY DAYS"
          value={String(studyDays)}
          description="unique study days"
        />

        <DashboardCard
          type="study-days"
          label="LATEST STUDY"
          value={latestStudyDate}
          description="most recent study date"
        />
      </section>
    </main>
  );
}

export default AdminDashboard;