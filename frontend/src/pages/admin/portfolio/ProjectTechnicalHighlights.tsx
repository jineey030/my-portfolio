import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefresh } from '../../../api/adminRefresh';

interface TechnicalHighlight {
  id: number;
  title: string;
  description: string;
}

interface ProjectTechnicalHighlightsProps {
  projectId: number;
}

function ProjectTechnicalHighlights({
  projectId
}: ProjectTechnicalHighlightsProps) {
  const [highlights, setHighlights] =
    useState<TechnicalHighlight[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAdding, setIsAdding] =
    useState(false);

  const [
    deletingHighlightId,
    setDeletingHighlightId
  ] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 제목에서 Enter를 누르면 설명 입력칸으로 이동
  const descriptionRef =
    useRef<HTMLTextAreaElement>(null);

  const fetchHighlights = async () => {
    try {
      setError('');

      const response = await apiFetch(
        `/api/projects/${projectId}/technical-highlights`
      );

      if (!response.ok) {
        throw new Error(
          'Technical Highlights 조회에 실패했습니다.'
        );
      }

      const data: TechnicalHighlight[] =
        await response.json();

      setHighlights(data);
    } catch (error) {
      console.error(error);

      setError(
        'Technical Highlights를 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [projectId]);

  useAdminRefresh(fetchHighlights);

  const clearNotice = () => {
    setError('');
    setMessage('');
  };

  const handleAddHighlight = async () => {
    // 추가 중에 연타해도 중복 요청하지 않음
    if (isAdding) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription =
      description.trim();

    if (!trimmedTitle) {
      setError(
        'Technical Highlight 제목을 입력해주세요.'
      );
      return;
    }

    if (!trimmedDescription) {
      setError(
        'Technical Highlight 설명을 입력해주세요.'
      );
      descriptionRef.current?.focus();
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/technical-highlights`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            title: trimmedTitle,
            description: trimmedDescription
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Technical Highlight 추가에 실패했습니다.'
        );
      }

      setTitle('');
      setDescription('');

      setMessage(
        'Technical Highlight가 추가되었습니다.'
      );

      await fetchHighlights();
    } catch (error) {
      console.error(error);

      setError(
        'Technical Highlight 추가에 실패했습니다.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteHighlight = async (
    highlight: TechnicalHighlight
  ) => {
    const confirmed = window.confirm(
      `"${highlight.title}" Technical Highlight를 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingHighlightId(highlight.id);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/technical-highlights/${highlight.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error(
          'Technical Highlight 삭제에 실패했습니다.'
        );
      }

      setMessage(
        'Technical Highlight가 삭제되었습니다.'
      );

      await fetchHighlights();
    } catch (error) {
      console.error(error);

      setError(
        'Technical Highlight 삭제에 실패했습니다.'
      );
    } finally {
      setDeletingHighlightId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-project-technical-highlights">
        <p>
          Technical Highlights를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-project-technical-highlights">

      <div className="admin-project-technical-highlights-header">
        <h3>Technical Highlights</h3>
      </div>

      {error && (
        <p className="admin-form-error">
          {error}
        </p>
      )}

      {message && (
        <p className="admin-form-message">
          {message}
        </p>
      )}

      <div className="admin-project-technical-highlights-list">
        {highlights.length === 0 ? (
          // 불러오기에 실패한 경우에는 "없음" 문구를 표시하지 않음
          !error && (
            <p>
              등록된 Technical Highlight가 없습니다.
            </p>
          )
        ) : (
          highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="admin-project-technical-highlight-item"
            >
              <div className="admin-project-technical-highlight-content">
                <h4>{highlight.title}</h4>

                <p>
                  {highlight.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDeleteHighlight(highlight)
                }
                disabled={
                  deletingHighlightId ===
                  highlight.id
                }
              >
                {deletingHighlightId ===
                highlight.id
                  ? 'Deleting...'
                  : 'Remove'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="admin-project-technical-highlights-add">

        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            clearNotice();
          }}
          onKeyDown={(event) => {
            // 제목에서 Enter → 설명 입력칸으로 이동 (한글 조합 중에는 무시)
            if (
              event.key === 'Enter' &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              descriptionRef.current?.focus();
            }
          }}
          placeholder="예: 상태 관리 구조 설계"
        />

        <textarea
          ref={descriptionRef}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            clearNotice();
          }}
          onKeyDown={(event) => {
            // Enter는 줄바꿈, Ctrl(⌘) + Enter로 추가
            if (
              event.key === 'Enter' &&
              (event.ctrlKey || event.metaKey) &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleAddHighlight();
            }
          }}
          placeholder="기술적으로 어떤 방식으로 구현했는지 설명해주세요. (Ctrl + Enter로 추가)"
          rows={4}
        />

        <button
          type="button"
          onClick={handleAddHighlight}
          disabled={isAdding}
        >
          {isAdding
            ? 'Adding...'
            : 'Add Technical Highlight'}
        </button>

      </div>

    </div>
  );
}

export default ProjectTechnicalHighlights;
