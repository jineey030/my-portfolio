import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';

interface Skill {
  id: number;
  name: string;
}

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
  const [skills, setSkills] = useState<ProjectSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAdding, setIsAdding] =
    useState(false);

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

  const fetchAllSkills = async () => {
    try {
      const response = await apiFetch(
        '/api/skills'
      );

      if (!response.ok) {
        throw new Error(
          '전체 Skills 조회에 실패했습니다.'
        );
      }

      const data = await response.json();

      setAllSkills(data);
    } catch (error) {
      console.error(error);

      setError(
        '전체 Skills를 불러오지 못했습니다.'
      );
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchAllSkills();
  }, [projectId]);

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      setError(
        '추가할 Skill을 선택해주세요.'
      );
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/skills/${selectedSkillId}`,
        {
          method: 'POST'
        }
      );

      if (!response.ok) {
        throw new Error(
          'Skill 연결에 실패했습니다.'
        );
      }

      setSelectedSkillId('');

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
              {skill.name}
            </div>
          ))
        )}
      </div>

      <div className="admin-project-skills-add">
        <select
          value={selectedSkillId}
          onChange={(event) =>
            setSelectedSkillId(
              event.target.value
            )
          }
        >
          <option value="">
            Skill을 선택하세요
          </option>

          {allSkills.map((skill) => (
            <option
              key={skill.id}
              value={skill.id}
            >
              {skill.name}
            </option>
          ))}
        </select>

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