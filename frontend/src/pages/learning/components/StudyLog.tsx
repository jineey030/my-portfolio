import { useEffect, useState } from 'react';
import type { StudyLogData } from '../types/learning';

interface StudyLogProps {
  onStudyLogsChange: (studyLogs: StudyLogData[]) => void;
}

function StudyLog({
  onStudyLogsChange
}: StudyLogProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [studyLog, setStudyLog] = useState('');
  const [studyLogs, setStudyLogs] = useState<StudyLogData[]>([]);

  const [editingStudyLogId, setEditingStudyLogId] = useState<number | null>(null);
  const [editingStudyLogContent, setEditingStudyLogContent] = useState('');

  const [studyLogError, setStudyLogError] = useState('');
  const [isStudyLogLoading, setIsStudyLogLoading] = useState(true);

  const [studyLogActionError, setStudyLogActionError] = useState('');
  const [isStudyLogSubmitting, setIsStudyLogSubmitting] = useState(false);

  // [GET] Study Log 가져오기
  useEffect(() => {
    const fetchStudyLogs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/study-logs`
        );

        if (!response.ok) {
          throw new Error('Study Log를 불러오지 못했습니다.');
        }

        const data: StudyLogData[] = await response.json();

        setStudyLogs(data);
      } catch (error) {
        console.error('Study Log 조회 실패:', error);
        setStudyLogError('Study Log를 불러오지 못했습니다.');
      } finally {
        setIsStudyLogLoading(false);
      }
    };

    fetchStudyLogs();
  }, []);

  // 부모에게 전달용
  useEffect(() => {
    onStudyLogsChange(studyLogs);
  }, [studyLogs, onStudyLogsChange]);

  // [POST] Study Log 추가
  const handleAddStudyLog = async () => {
    const content = studyLog.trim();

    if (!content) {
      return;
    }

    setStudyLogActionError('');
    setIsStudyLogSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/study-logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Study Log 추가에 실패했습니다.');
      }

      const createdLog: StudyLogData = await response.json();

      setStudyLogs((prev) => [
        ...prev,
        createdLog,
      ]);

      setStudyLog('');
    } catch (error) {
      console.error('Study Log 추가 실패:', error);
      setStudyLogActionError('Study Log 추가에 실패했습니다.');
    } finally {
      setIsStudyLogSubmitting(false);
    }
  };

  // [SET] Study Log 수정 상태
  const handleStartEditStudyLog = (
    id: number,
    content: string
  ) => {
    setEditingStudyLogId(id);
    setEditingStudyLogContent(content);
  };

  const handleCancelEditStudyLog = () => {
    setEditingStudyLogId(null);
    setEditingStudyLogContent('');
  };

  // [PUT] Study Log 수정
  const handleSaveStudyLog = async (id: number) => {
    const content = editingStudyLogContent.trim();

    if (!content) {
      return;
    }

    const studyLog = studyLogs.find(
      (log) => log.id === id
    );

    if (!studyLog) {
      return;
    }

    setStudyLogActionError('');
    setIsStudyLogSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/study-logs/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: studyLog.date,
            content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Study Log 수정에 실패했습니다.');
      }

      const updatedLog: StudyLogData = await response.json();

      setStudyLogs((prev) =>
        prev.map((log) =>
          log.id === id ? updatedLog : log
        )
      );

      handleCancelEditStudyLog();
    } catch (error) {
      console.error('Study Log 수정 실패:', error);
      setStudyLogActionError('Study Log 수정에 실패했습니다.');
    } finally {
      setIsStudyLogSubmitting(false);
    }
  };

  // [DELETE] Study Log 삭제
  const handleDeleteStudyLog = async (id: number) => {
    const shouldDelete = window.confirm(
      '이 Study Log를 삭제하시겠습니까?'
    );

    if (!shouldDelete) {
      return;
    }

    setStudyLogActionError('');
    setIsStudyLogSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/study-logs/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Study Log 삭제에 실패했습니다.');
      }

      setStudyLogs((prev) =>
        prev.filter((log) => log.id !== id)
      );
    } catch (error) {
      console.error('Study Log 삭제 실패:', error);
      setStudyLogActionError('Study Log 삭제에 실패했습니다.');
    } finally {
      setIsStudyLogSubmitting(false);
    }
  };

  return (
    <section className="learning-study-log">
      <div className="learning-section-header">
        <div>
          <p className="learning-section-label">
            02 / STUDY LOG
          </p>

          <h2>Study Log</h2>
        </div>
      </div>

      <div className="study-log-form">
        <textarea
          value={studyLog}
          onChange={(event) =>
            setStudyLog(event.target.value)
          }
          placeholder="오늘 공부한 내용을 기록하세요"
          rows={5}
        />

        {studyLogActionError && (
          <p className="study-log-action-error">
            {studyLogActionError}
          </p>
        )}

        <button
          type="button"
          onClick={handleAddStudyLog}
          disabled={isStudyLogSubmitting}
        >
          {isStudyLogSubmitting ? '추가 중...' : '기록 추가'}
        </button>
      </div>

      <div className="study-log-list">
        {isStudyLogLoading ? (
          <p className="study-log-loading">
            Study Log를 불러오는 중...
          </p>
        ) : studyLogError ? (
          <p className="study-log-error">
            {studyLogError}
          </p>
        ) : studyLogs.length === 0 ? (
          <p className="study-log-empty">
            아직 작성된 학습 기록이 없습니다.
          </p>
        ) : (
          studyLogs.map((log) => (
            <article
              key={log.id}
              className="study-log-item"
            >
              <time>{log.date}</time>

              {editingStudyLogId === log.id ? (
                <textarea
                  value={editingStudyLogContent}
                  onChange={(event) =>
                    setEditingStudyLogContent(event.target.value)
                  }
                  rows={4}
                />
              ) : (
                <p>{log.content}</p>
              )}

              <div className="study-log-actions">
                {editingStudyLogId === log.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveStudyLog(log.id)
                      }
                      disabled={isStudyLogSubmitting}
                    >
                      {isStudyLogSubmitting
                        ? '저장 중...'
                        : '저장'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEditStudyLog}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleStartEditStudyLog(
                          log.id,
                          log.content
                        )
                      }
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteStudyLog(log.id)
                      }
                      disabled={isStudyLogSubmitting}
                    >
                      {isStudyLogSubmitting
                        ? '삭제 중...'
                        : '삭제'}
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default StudyLog;
