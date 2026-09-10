import StudyLog from '../learning/components/StudyLog';
import { useLearning } from '../learning/context/LearningContext';

function AdminStudyLogs() {
  const {
    setStudyLogs
  } = useLearning();

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="admin-page-label">
          ADMIN / STUDY LOGS
        </p>

        <h1>Study Logs</h1>

        <p className="admin-page-description">
          학습 기록을 관리합니다.
        </p>
      </header>

      <StudyLog
        onStudyLogsChange={setStudyLogs}
      />
    </main>
  );
}

export default AdminStudyLogs;