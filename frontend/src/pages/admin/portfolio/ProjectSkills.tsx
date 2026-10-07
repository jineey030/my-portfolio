import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';

interface ProjectSkill {
  id: number;
  name: string;
}

interface ProjectSkillsProps {
  projectId: number;
}

function ProjectSkills({
  projectId
}: ProjectSkillsProps) {
  const [skills, setSkills] =
    useState<ProjectSkill[]>([]);

  const [skillName, setSkillName] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAdding, setIsAdding] =
    useState(false);

  const [deletingSkillId, setDeletingSkillId] =
    useState<number | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchSkills = async () => {
    try {
      setError('');

      const response = await apiFetch(
        `/api/projects/${projectId}/skills`
      );

      if (!response.ok) {
        throw new Error(
          'Project Skills 조회에 실패했습니다.'
        );
      }

      const data = await response.json();

      setSkills(data);
    } catch (error) {
      console.error(error);

      setError(
        'Skills를 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [projectId]);

  const handleAddSkill = async () => {
    const name = skillName.trim();

    if (!name) {
      setError(
        'Skill 이름을 입력해주세요.'
      );
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/skills`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            name
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Skill 추가에 실패했습니다.'
        );
      }

      setSkillName('');

      setMessage(
        'Skill이 추가되었습니다.'
      );

      await fetchSkills();
    } catch (error) {
      console.error(error);

      setError(
        'Skill 추가에 실패했습니다.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (
    skillId: number
  ) => {
    try {
      setDeletingSkillId(skillId);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/skills/${skillId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error(
          'Skill 삭제에 실패했습니다.'
        );
      }

      setMessage(
        'Skill이 삭제되었습니다.'
      );

      await fetchSkills();
    } catch (error) {
      console.error(error);

      setError(
        'Skill 삭제에 실패했습니다.'
      );
    } finally {
      setDeletingSkillId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-project-skills">
        <p>Skills를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="admin-project-skills">
      <div className="admin-project-skills-header">
        <h3>Skills</h3>
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

      <div className="admin-project-skills-list">
        {skills.length === 0 ? (
          <p>
            등록된 Skill이 없습니다.
          </p>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="admin-project-skill-item"
            >
              <span>{skill.name}</span>

              <button
                type="button"
                onClick={() =>
                  handleDeleteSkill(skill.id)
                }
                disabled={
                  deletingSkillId === skill.id
                }
              >
                {deletingSkillId === skill.id
                  ? 'Deleting...'
                  : 'Remove'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="admin-project-skills-add">
        <input
          type="text"
          value={skillName}
          onChange={(event) =>
            setSkillName(event.target.value)
          }
          placeholder="예: React + TypeScript"
        />

        <button
          type="button"
          onClick={handleAddSkill}
          disabled={isAdding}
        >
          {isAdding
            ? 'Adding...'
            : 'Add Skill'}
        </button>
      </div>
    </div>
  );
}

export default ProjectSkills;
