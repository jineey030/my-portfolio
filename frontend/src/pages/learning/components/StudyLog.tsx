import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefreshKey } from '../../../api/adminRefresh';

import type { StudyLogData } from '../types/learning';
import Pagination from './Pagination';

interface StudyLogProps {
  onStudyLogsChange: (studyLogs: StudyLogData[]) => void;
}

const ITEMS_PER_PAGE = 5;

/**
 * 오늘 날짜를 'YYYY-MM-DD'로 반환 (사용자 기기의 현지 시간 기준)
 * toISOString()은 UTC 기준이라 한국에서 오전 9시 이전에 쓰면 전날 날짜가 된다.
 */
function getLocalToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// '2026-10-15T...' → '2026-10-15'
const toDateOnly = (date: string) => date.slice(0, 10);

function StudyLog({
  onStudyLogsChange
}: StudyLogProps) {
  const [studyLog, setStudyLog] = useState('');
  const [studyLogs, setStudyLogs] = useState<StudyLogData[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const [editingStudyLogId, setEditingStudyLogId] = useState<number | null>(null);
  const [editingStudyLogContent, setEditingStudyLogContent] = useState('');

  const [studyLogError, setStudyLogError] = useState('');
  const [isStudyLogLoading, setIsStudyLogLoading] = useState(true);

  const [studyLogActionError, setStudyLogActionError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingStudyLogId, setDeletingStudyLogId] = useState<number | null>(null);

  const refreshKey = useAdminRefreshKey();

  const keyword = searchTerm.trim().toLowerCase();

  const filteredStudyLogs = studyLogs
    .filter((log) => {
      if (!keyword) {
        return true;
      }

      return log.content.toLowerCase().includes(keyword);
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      // 같은 날짜면 나중에 작성한 기록(id가 큰 쪽)을 기준으로 정렬
      const diff = dateA === dateB
        ? a.id - b.id
        : dateA - dateB;

      return sortOrder === 'latest' ? -diff : diff;
    });

  const totalPages = Math.ceil(
    filteredStudyLogs.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const currentStudyLogs = filteredStudyLogs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // 검색어나 정렬이 바뀌면 첫 페이지로
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  // [GET] Study Log 가져오기
  useEffect(() => {
    const fetchStudyLogs = async () => {
      try {
        const response = await apiFetch(
          `/api/study-logs`
        );

        if (!response.ok) {
          throw new Error('Study Log를 불러오지 못했습니다.');
        }

        const data: StudyLogData[] = await response.json();

        setStudyLogs(data);
        setStudyLogError('');
      } catch (error) {
        console.error('Study Log 조회 실패:', error);
        setStudyLogError('Study Log를 불러오지 못했습니다.');
      } finally {
        setIsStudyLogLoading(false);
      }
    };

    fetchStudyLogs();
  }, [refreshKey]);

  // 부모에게 전달용
  useEffect(() => {
    onStudyLogsChange(studyLogs);
  }, [studyLogs, onStudyLogsChange]);

  // 삭제나 검색으로 페이지 수가 줄면 마지막 페이지로 이동
  // (검색 중일 때도 맞도록 "검색된 결과" 기준으로 계산)
  useEffect(() => {
    const lastPage = Math.max(1, totalPages);

    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [totalPages, currentPage]);

  // [POST] Study Log 추가
  const handleAddStudyLog = async () => {
    const content = studyLog.trim();

    if (!content || isAdding) {
      return;
    }

    setStudyLogActionError('');
    setIsAdding(true);

    try {
      const response = await apiFetch(
        `/api/study-logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: getLocalToday(),
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

      // 방금 추가한 기록이 보이도록 (최신순이면 첫 페이지 맨 위)
      setSearchTerm('');
      setCurrentPage(
        sortOrder === 'latest'
          ? 1
          : Math.max(1, Math.ceil((studyLogs.length + 1) / ITEMS_PER_PAGE))
      );
    } catch (error) {
      console.error('Study Log 추가 실패:', error);
      setStudyLogActionError('Study Log 추가에 실패했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  // [SET] Study Log 수정 상태
  const handleStartEditStudyLog = (
    id: number,
    content: string
  ) => {
    setStudyLogActionError('');
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

    if (!content || isSavingEdit) {
      return;
    }

    const targetLog = studyLogs.find(
      (log) => log.id === id
    );

    if (!targetLog) {
      return;
    }

    setStudyLogActionError('');
    setIsSavingEdit(true);

    try {
      const response = await apiFetch(
        `/api/study-logs/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: targetLog.date,
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
      setIsSavingEdit(false);
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
    setDeletingStudyLogId(id);

    try {
      const response = await apiFetch(
        `/api/study-logs/${id}`,
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

      // 수정 중이던 기록을 삭제했다면 수정 상태도 정리
      if (editingStudyLogId === id) {
        handleCancelEditStudyLog();
      }
    } catch (error) {
      console.error('Study Log 삭제 실패:', error);
      setStudyLogActionError('Study Log 삭제에 실패했습니다.');
    } finally {
      setDeletingStudyLogId(null);
    }
  };

  return (
    <section className="learning-study-log">
      <div className="learning-section-header">
        <div>
          <h2>Study Log</h2>
        </div>
      </div>

      <div className="study-log-search">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="학습 기록 검색..."
          aria-label="학습 기록 검색"
        />

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(
              event.target.value as 'latest' | 'oldest'
            )
          }
          aria-label="정렬 순서"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      {keyword && (
        <p className="study-log-search-result">
          검색 결과 {filteredStudyLogs.length}개
        </p>
      )}

      <div className="study-log-form">
        <textarea
          value={studyLog}
          onChange={(event) => {
            setStudyLog(event.target.value);
            setStudyLogActionError('');
          }}
          onKeyDown={(event) => {
            // Enter는 줄바꿈, Ctrl(⌘) + Enter로 추가
            if (
              event.key === 'Enter' &&
              (event.ctrlKey || event.metaKey) &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleAddStudyLog();
            }
          }}
          placeholder="오늘 공부한 내용을 기록하세요 (Ctrl + Enter로 추가)"
          rows={5}
        />

        {studyLogActionError && (
          <p
            className="study-log-action-error"
            role="alert"
          >
            {studyLogActionError}
          </p>
        )}

        <button
          type="button"
          onClick={handleAddStudyLog}
          // 내용이 비어 있으면 눌러도 아무 일이 없으므로 비활성화
          disabled={isAdding || !studyLog.trim()}
        >
          {isAdding ? '추가 중...' : '기록 추가'}
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
            아직 학습 기록이 없습니다.
          </p>
        ) : filteredStudyLogs.length === 0 ? (
          <p className="study-log-empty">
            검색 결과가 없습니다.
            <br />
            다른 검색어를 입력해보세요.
          </p>
        ) : (
          currentStudyLogs.map((log) => {
            const isEditing = editingStudyLogId === log.id;

            return (
              <article
                key={log.id}
                className="study-log-item"
              >
                <time dateTime={toDateOnly(log.date)}>
                  {toDateOnly(log.date)}
                </time>

                {isEditing ? (
                  <textarea
                    value={editingStudyLogContent}
                    onChange={(event) =>
                      setEditingStudyLogContent(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.nativeEvent.isComposing) {
                        return;
                      }

                      // Esc로 취소, Ctrl(⌘) + Enter로 저장
                      if (event.key === 'Escape') {
                        handleCancelEditStudyLog();
                      }

                      if (
                        event.key === 'Enter' &&
                        (event.ctrlKey || event.metaKey)
                      ) {
                        event.preventDefault();
                        handleSaveStudyLog(log.id);
                      }
                    }}
                    aria-label="Study Log 수정"
                    rows={4}
                    autoFocus
                  />
                ) : (
                  <p>{log.content}</p>
                )}

                <div className="study-log-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveStudyLog(log.id)
                        }
                        disabled={
                          isSavingEdit ||
                          !editingStudyLogContent.trim()
                        }
                      >
                        {isSavingEdit
                          ? '저장 중...'
                          : '저장'}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEditStudyLog}
                        disabled={isSavingEdit}
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
                        onClick={() => handleDeleteStudyLog(log.id)}
                        disabled={deletingStudyLogId !== null}
                      >
                        {deletingStudyLogId === log.id
                          ? '삭제 중...'
                          : '삭제'}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        variant="study-log"
      />
    </section>
  );
}

export default StudyLog;
