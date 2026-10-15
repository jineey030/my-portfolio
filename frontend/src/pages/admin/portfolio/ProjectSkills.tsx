import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefresh } from '../../../api/adminRefresh';
import AdminSelect from '../../../components/admin/AdminSelect';

interface ProjectSkill {
  id: number;
  name: string;
  category: string;
}

interface ProjectSkillsProps {
  projectId: number;
}

const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'DB',
  'Infra'
] as const;

const FALLBACK_CATEGORY = 'Etc';

function ProjectSkills({
  projectId
}: ProjectSkillsProps) {
  const [skills, setSkills] =
    useState<ProjectSkill[]>([]);

  const [skillName, setSkillName] =
    useState('');

  const [category, setCategory] =
    useState<string>('Frontend');

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

      const data: ProjectSkill[] =
        await response.json();

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
    setIsLoading(true);
    fetchSkills();
  }, [projectId]);

  // 다른 곳에서 데이터가 바뀌어도 목록 자동 새로고침
  useAdminRefresh(fetchSkills);

  const groupedSkills = skills.reduce<
    Record<string, ProjectSkill[]>
  >((result, skill) => {
    const key =
      skill.category?.trim() || FALLBACK_CATEGORY;

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(skill);

    return result;
  }, {});

  // 기본 카테고리 순서 → 그 외 카테고리 순으로 표시
  const categoryOrder = [
    ...SKILL_CATEGORIES,
    ...Object.keys(groupedSkills).filter(
      (key) =>
        !(SKILL_CATEGORIES as readonly string[]).includes(key)
    )
  ];

  const handleAddSkill = async () => {
    // 추가 중에 Enter를 연타해도 중복 요청하지 않음
    if (isAdding) {
      return;
    }

    const name = skillName.trim();

    if (!name) {
      setError('Skill 이름을 입력해주세요.');
      return;
    }

    if (!category) {
      setError('Skill 카테고리를 선택해주세요.');
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            category
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          'Skill 추가 실패:',
          response.status,
          errorText
        );

        throw new Error(
          'Skill 추가에 실패했습니다.'
        );
      }

      const saved: ProjectSkill =
        await response.json();

      const existing = skills.find(
        (skill) => skill.id === saved.id
      );

      setSkillName('');

      // 새로 추가 / 카테고리 변경 / 이미 같은 카테고리에 있음을 구분
      if (!existing) {
        setMessage(
          `${saved.name}이(가) ${saved.category}에 추가되었습니다.`
        );
      } else if (existing.category !== saved.category) {
        setMessage(
          `${saved.name}의 카테고리를 ${saved.category}(으)로 변경했습니다.`
        );
      } else {
        setMessage(
          `${saved.name}은(는) 이미 ${saved.category}에 등록되어 있습니다.`
        );
      }

      await fetchSkills();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : 'Skill 추가에 실패했습니다.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (
    skill: ProjectSkill
  ) => {
    const confirmed = window.confirm(
      `"${skill.name}" Skill을 이 프로젝트에서 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSkillId(skill.id);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/skills/${skill.id}`,
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
        '프로젝트에서 Skill 연결이 삭제되었습니다.'
      );

      await fetchSkills();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : 'Skill 삭제에 실패했습니다.'
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
          // 불러오기에 실패한 경우에는 "없음" 문구를 표시하지 않음
          !error && <p>등록된 Skill이 없습니다.</p>
        ) : (
          categoryOrder.map((categoryName) => {
            const categorySkills =
              groupedSkills[categoryName] ?? [];

            if (categorySkills.length === 0) {
              return null;
            }

            return (
              <div
                key={categoryName}
                className="admin-project-skill-category"
              >
                <h4>{categoryName}</h4>

                <div className="admin-project-skill-items">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="admin-project-skill-item"
                    >
                      <span>{skill.name}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSkill(skill)
                        }
                        disabled={
                          deletingSkillId === skill.id
                        }
                        aria-label={`${skill.name} 삭제`}
                      >
                        {deletingSkillId === skill.id
                          ? 'Deleting...'
                          : 'Remove'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-project-skills-add">
        <input
          type="text"
          value={skillName}
          onChange={(event) => {
            setSkillName(event.target.value);

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
              handleAddSkill();
            }
          }}
          placeholder="예: React, Kotlin, MySQL"
        />

        <AdminSelect
          value={category}
          options={SKILL_CATEGORIES}
          onChange={setCategory}
          ariaLabel="Skill 카테고리"
          disabled={isAdding}
        />

        <button
          type="button"
          onClick={handleAddSkill}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Skill'}
        </button>
      </div>
    </div>
  );
}

export default ProjectSkills;
