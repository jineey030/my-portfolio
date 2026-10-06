import { useEffect, useState } from 'react';
import SectionTitle from '../../../components/ui/SectionTitle';

interface PortfolioSkill {
  id: number;
  category: string;
  name: string;
}

function Skills() {
  const [skills, setSkills] = useState<PortfolioSkill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/portfolio-skills'
        );

        if (!response.ok) {
          throw new Error('Skills를 불러오지 못했습니다.');
        }

        const data: PortfolioSkill[] = await response.json();
        
        setSkills(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce<
    Record<string, PortfolioSkill[]>
  >((groups, skill) => {
    if (!groups[skill.category]) {
      groups[skill.category] = [];
    }

    groups[skill.category].push(skill);

    return groups;
  }, {});

  return (
    <section id="skills">
      <SectionTitle>Skills</SectionTitle>

      <div className="skills-code">
        <span className="code-keyword">const</span> skills = {'{'}

        {Object.entries(groupedSkills).map(
          ([category, categorySkills]) => (
            <div
              key={category}
              className="skills-line"
            >
              <span className="code-key">
                {category}
              </span>
              : [

              {categorySkills.map((skill, i) => (
                <span key={skill.id}>
                  <span className="code-string">
                    '{skill.name}'
                  </span>

                  {i < categorySkills.length - 1
                    ? ', '
                    : ''}
                </span>
              ))}

              ],
            </div>
          )
        )}

        {'}'}
      </div>
    </section>
  );
}

export default Skills;
