import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefresh } from '../../../api/adminRefresh';

interface ProjectChallenge {
  id: number;
  name: string;
}

interface ProjectChallengesProps {
  projectId: number;
}

function ProjectChallenges({
  projectId
}: ProjectChallengesProps) {
  const [challenges, setChallenges] =
    useState<ProjectChallenge[]>([]);

  const [challengeName, setChallengeName] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAdding, setIsAdding] =
    useState(false);

  const [deletingChallengeId, setDeletingChallengeId] =
    useState<number | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchChallenges = async () => {
    try {
      setError('');

      const response = await apiFetch(
        `/api/projects/${projectId}/challenges`
      );

      if (!response.ok) {
        throw new Error(
          'Project Challenges 조회에 실패했습니다.'
        );
      }

      const data: ProjectChallenge[] =
        await response.json();

      setChallenges(data);
    } catch (error) {
      console.error(error);

      setError(
        'Challenges를 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [projectId]);

  useAdminRefresh(fetchChallenges);

  const handleAddChallenge = async () => {
    // 추가 중에 Enter를 연타해도 중복 요청하지 않음
    if (isAdding) {
      return;
    }

    const name = challengeName.trim();

    if (!name) {
      setError(
        'Challenge 이름을 입력해주세요.'
      );
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/challenges`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Challenge 추가에 실패했습니다.'
        );
      }

      setChallengeName('');

      setMessage(
        'Challenge가 추가되었습니다.'
      );

      await fetchChallenges();
    } catch (error) {
      console.error(error);

      setError(
        'Challenge 추가에 실패했습니다.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteChallenge = async (
    challenge: ProjectChallenge
  ) => {
    const confirmed = window.confirm(
      `"${challenge.name}" Challenge를 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingChallengeId(challenge.id);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/challenges/${challenge.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error(
          'Challenge 삭제에 실패했습니다.'
        );
      }

      setMessage(
        'Challenge가 삭제되었습니다.'
      );

      await fetchChallenges();
    } catch (error) {
      console.error(error);

      setError(
        'Challenge 삭제에 실패했습니다.'
      );
    } finally {
      setDeletingChallengeId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-project-challenges">
        <p>Challenges를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="admin-project-challenges">

      <div className="admin-project-challenges-header">
        <h3>Challenges</h3>
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

      <div className="admin-project-challenges-list">
        {challenges.length === 0 ? (
          // 불러오기에 실패한 경우에는 "없음" 문구를 표시하지 않음
          !error && (
            <p>
              등록된 Challenge가 없습니다.
            </p>
          )
        ) : (
          challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="admin-project-challenge-item"
            >
              <span>{challenge.name}</span>

              <button
                type="button"
                onClick={() =>
                  handleDeleteChallenge(challenge)
                }
                disabled={
                  deletingChallengeId ===
                  challenge.id
                }
              >
                {deletingChallengeId ===
                challenge.id
                  ? 'Deleting...'
                  : 'Remove'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="admin-project-challenges-add">
        <input
          type="text"
          value={challengeName}
          onChange={(event) => {
            setChallengeName(event.target.value);

            // 다시 입력하기 시작하면 이전 안내 문구 제거
            setError('');
            setMessage('');
          }}
          onKeyDown={(event) => {
            // 한글 조합 중 Enter는 무시 (마지막 글자 중복 입력 방지)
            if (
              event.key === 'Enter' &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleAddChallenge();
            }
          }}
          placeholder="예: 상태 관리 구조 설계"
        />

        <button
          type="button"
          onClick={handleAddChallenge}
          disabled={isAdding}
        >
          {isAdding
            ? 'Adding...'
            : 'Add Challenge'}
        </button>
      </div>

    </div>
  );
}

export default ProjectChallenges;
