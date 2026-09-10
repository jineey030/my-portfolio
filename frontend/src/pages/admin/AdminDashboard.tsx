import { useEffect } from 'react';

import { apiFetch } from '../../api/api';

import DashboardCard from '../learning/components/DashboardCard';
import { useLearning } from '../learning/context/LearningContext';

import type {
  Todo,
  StudyLogData
} from '../learning/types/learning';

function AdminDashboard() {
  const {
    todos,
    studyLogs,
    setTodos,
    setStudyLogs
  } = useLearning();

  // Dashboard 진입 시 DB 데이터 조회
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          todosResponse,
          studyLogsResponse
        ] = await Promise.all([
          apiFetch('/api/todos'),
          apiFetch('/api/study-logs')
        ]);

        if (!todosResponse.ok) {
          throw new Error(
            'Todo를 불러오지 못했습니다.'
          );
        }

        if (!studyLogsResponse.ok) {
          throw new Error(
            'Study Log를 불러오지 못했습니다.'
          );
        }

        const todosData: Todo[] =
          await todosResponse.json();

        const studyLogsData: StudyLogData[] =
          await studyLogsResponse.json();

        setTodos(todosData);
        setStudyLogs(studyLogsData);
      } catch (error) {
        console.error(
          'Dashboard 데이터 조회 실패:',
          error
        );
      }
    };

    fetchDashboardData();
  }, [setTodos, setStudyLogs]);

  const completedTodoCount =
    todos.filter(
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
          (completedTodoCount /
            totalTodoCount) *
            100
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
