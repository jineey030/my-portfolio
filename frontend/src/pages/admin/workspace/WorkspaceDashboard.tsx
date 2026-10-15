import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { apiFetch } from '../../../api/api';
import { useAdminRefreshKey } from '../../../api/adminRefresh';

import DashboardCard from '../../learning/components/DashboardCard';
import { useLearning } from '../../learning/context/LearningContext';

import type {
  Todo,
  StudyLogData
} from '../../learning/types/learning';

// 월별 차트에 보여줄 최대 개월 수 (너무 많으면 막대가 좁아져서 읽기 어려움)
const MAX_CHART_MONTHS = 12;

// '2026-10-15T...' → '2026.10.15'
const formatDate = (date: string) =>
  date.slice(0, 10).replace(/-/g, '.');

function AdminDashboard() {
  const {
    todos,
    studyLogs,
    setTodos,
    setStudyLogs
  } = useLearning();

  const refreshKey = useAdminRefreshKey();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Dashboard 진입 시 DB 데이터 조회 (+ 데이터 변경 시 자동 새로고침)
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
        setError('');
      } catch (error) {
        console.error(
          'Dashboard 데이터 조회 실패:',
          error
        );

        // 실패를 화면에 알려서 "데이터가 0개"로 오해하지 않게 함
        setError(
          error instanceof Error
            ? error.message
            : 'Dashboard 데이터를 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [setTodos, setStudyLogs, refreshKey]);

  const completedTodoCount =
    todos.filter(
      (todo) => todo.completed
    ).length;

  const totalTodoCount = todos.length;
  const studyLogCount = studyLogs.length;

  const studyDays = new Set(
    studyLogs.map((log) => log.date?.slice(0, 10))
  ).size;

  const latestStudyDate =
    studyLogs.length === 0
      ? '-'
      : formatDate(
          studyLogs
            .map((log) => log.date)
            .sort()
            .at(-1) ?? '-'
        );

  const todoProgress =
    totalTodoCount === 0
      ? 0
      : Math.round(
          (completedTodoCount /
            totalTodoCount) *
            100
        );

  const recentTodos = [...todos]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const recentStudyLogs = [...studyLogs]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // 'YYYY-MM' 기준으로 개수 집계
  const monthlyStudyLogs = studyLogs.reduce(
    (acc, log) => {
      if (!log.date) {
        return acc;
      }

      const yearMonth = log.date.slice(0, 7);

      acc[yearMonth] = (acc[yearMonth] ?? 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  );

  const monthlyEntries = Object.entries(
    monthlyStudyLogs
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-MAX_CHART_MONTHS);

  // 여러 해에 걸쳐 있으면 '25.10'처럼 연도까지 표시 (같은 '10월'이 두 개 생기는 것 방지)
  const hasMultipleYears =
    new Set(
      monthlyEntries.map(([yearMonth]) =>
        yearMonth.slice(0, 4)
      )
    ).size > 1;

  const monthlyStudyLogData = monthlyEntries.map(
    ([yearMonth, count]) => ({
      key: yearMonth,
      label: hasMultipleYears
        ? `${yearMonth.slice(2, 4)}.${yearMonth.slice(5)}`
        : `${Number(yearMonth.slice(5))}월`,
      count
    })
  );

  // 막대 높이 기준값은 한 번만 계산
  const maxMonthlyCount = Math.max(
    1,
    ...monthlyStudyLogData.map((item) => item.count)
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

      {error && (
        <p
          className="admin-form-error"
          role="alert"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="admin-recent-empty">
          Dashboard 데이터를 불러오는 중...
        </p>
      ) : (
        <>
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

          <section className="admin-monthly-study">
            <div className="admin-monthly-header">
              <div>
                <p className="admin-recent-label">
                  STUDY LOGS
                </p>

                <h2>Monthly Study Logs</h2>
              </div>
            </div>

            {monthlyStudyLogData.length === 0 ? (
              <p className="admin-recent-empty">
                Study Log가 없습니다.
              </p>
            ) : (
              <div className="admin-monthly-chart">
                {monthlyStudyLogData.map((item) => (
                  <div
                    key={item.key}
                    className="admin-monthly-item"
                  >
                    <span className="admin-monthly-count">
                      {item.count}
                    </span>

                    <div className="admin-monthly-bar">
                      <div
                        className="admin-monthly-bar-fill"
                        style={{
                          height: `${Math.max(
                            (item.count / maxMonthlyCount) * 100,
                            8
                          )}%`
                        }}
                      />
                    </div>

                    <span className="admin-monthly-label">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="admin-recent">
            <div className="admin-recent-card">
              <div className="admin-recent-header">
                <p className="admin-recent-label">
                  RECENT TODOS
                </p>

                <Link
                  to="/admin/todos"
                  className="admin-recent-link"
                >
                  전체 보기 →
                </Link>
              </div>

              {recentTodos.length === 0 ? (
                <p className="admin-recent-empty">
                  최근 Todo가 없습니다.
                </p>
              ) : (
                <ul className="admin-recent-list">
                  {recentTodos.map((todo) => (
                    <li key={todo.id}>
                      <div className="admin-recent-item">
                        <span
                          className={`admin-todo-status ${
                            todo.completed
                              ? 'completed'
                              : ''
                          }`}
                          aria-label={
                            todo.completed ? '완료' : '미완료'
                          }
                        >
                          {todo.completed ? '✓' : '○'}
                        </span>

                        <span className="admin-recent-title">
                          {todo.title}
                        </span>

                        {/* priority가 비어 있는 Todo가 있어도 화면이 깨지지 않게 */}
                        {todo.priority && (
                          <span
                            className={`admin-priority ${todo.priority}`}
                          >
                            {todo.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="admin-recent-card">
              <div className="admin-recent-header">
                <p className="admin-recent-label">
                  RECENT STUDY LOGS
                </p>

                <Link
                  to="/admin/study-logs"
                  className="admin-recent-link"
                >
                  전체 보기 →
                </Link>
              </div>

              {recentStudyLogs.length === 0 ? (
                <p className="admin-recent-empty">
                  최근 Study Log가 없습니다.
                </p>
              ) : (
                <ul className="admin-recent-list">
                  {recentStudyLogs.map((log) => (
                    <li key={log.id}>
                      <div className="admin-study-log-item">
                        <span className="admin-study-log-date">
                          {log.date ? formatDate(log.date) : '-'}
                        </span>

                        <span className="admin-recent-title">
                          {log.content}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default AdminDashboard;
