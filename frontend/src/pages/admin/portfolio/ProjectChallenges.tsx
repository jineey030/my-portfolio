import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';

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

  const handleAddChallenge = async () => {
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
    challengeId: number
  ) => {
    try {
      setDeletingChallengeId(challengeId);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/challenges/${challengeId}`,
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
          <p>
            등록된 Challenge가 없습니다.
          </p>
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
                  handleDeleteChallenge(
                    challenge.id
                  )
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
          onChange={(event) =>
            setChallengeName(event.target.value)
          }
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