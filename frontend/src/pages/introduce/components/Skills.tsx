import { useEffect, useState } from 'react';
import SectionTitle from '../../../components/ui/SectionTitle';
import { apiFetch } from '../../../api/api';

interface PortfolioSkill {
  id: number;
  category: string;
  name: string;
}

// 관리자 화면(ProjectSkills)과 같은 순서로 표시, 그 외 카테고리는 뒤에 붙인다
const CATEGORY_ORDER = ['Frontend', 'Backend', 'DB', 'Infra'];
const FALLBACK_CATEGORY = 'Etc';

// 로딩 중 스켈레톤 줄 길이 (코드 한 줄씩)
const SKELETON_LINE_WIDTHS = ['72%', '58%', '40%', '50%'];

function Skills() {
  const [skills, setSkills] = useState<PortfolioSkill[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchSkills = async () => {
      try {
        const response = await apiFetch('/api/portfolio-skills');

        if (!response.ok) {
          throw new Error('Skills를 불러오지 못했습니다.');
        }

        const data: PortfolioSkill[] = await response.json();

        if (!cancelled) {
          setSkills(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  const groupedSkills = skills.reduce<Record<string, PortfolioSkill[]>>(
    (groups, skill) => {
      // 카테고리가 비어 있는 Skill도 빠지지 않도록
      const category = skill.category?.trim() || FALLBACK_CATEGORY;

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);
      return groups;
    },
    {}
  );

  // API 응답 순서와 상관없이 항상 같은 순서로 표시
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    return (
      (indexA === -1 ? CATEGORY_ORDER.length : indexA) -
      (indexB === -1 ? CATEGORY_ORDER.length : indexB)
    );
  });

  const renderBody = () => {
    // 로딩 중: 코드 줄 모양의 스켈레톤
    if (isLoading) {
      return SKELETON_LINE_WIDTHS.map((width, index) => (
        <div key={index} className="skills-line">
          <span
            className="skeleton-line skills-skeleton-line"
            style={{ width }}
          />
        </div>
      ));
    }

    // 실패 / 빈 목록: 코드 블록 분위기에 맞게 주석으로 안내
    if (hasError) {
      return (
        <div className="skills-line code-comment">
          {'// Skills를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'}
        </div>
      );
    }

    if (sortedCategories.length === 0) {
      return (
        <div className="skills-line code-comment">
          {'// 등록된 Skill이 없습니다.'}
        </div>
      );
    }

    return sortedCategories.map((category) => {
      const categorySkills = groupedSkills[category];

      return (
        <div key={category} className="skills-line">
          <span className="code-key">{category}</span>: [
          {categorySkills.map((skill, index) => (
            <span key={skill.id}>
              <span className="code-string">'{skill.name}'</span>
              {index < categorySkills.length - 1 ? ', ' : ''}
            </span>
          ))}
          ],
        </div>
      );
    });
  };

  return (
    <section id="skills" aria-busy={isLoading}>
      <SectionTitle>Skills</SectionTitle>

      <div
        className="skills-code"
        role={isLoading ? 'status' : undefined}
        aria-label={isLoading ? 'Skills를 불러오는 중' : undefined}
      >
        <span className="code-keyword">const</span> skills = {'{'}

        {renderBody()}

        {'}'}
      </div>
    </section>
  );
}

export default Skills;
