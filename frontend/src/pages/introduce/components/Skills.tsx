import { SKILLS } from '../constants/skills';
import SectionTitle from '../../../components/ui/SectionTitle';

function Skills() {
  return (
    <section id="skills">
      <SectionTitle>Skills</SectionTitle>

      <div className="skills-code">
        <span className="code-keyword">const</span> skills = {'{'}

        {SKILLS.map((s) => (
          <div
            key={s.category}
            className="skills-line"
          >
            <span className="code-key">
              {s.category}
            </span>
            : [

            {s.items.map((item, i) => (
              <span key={item}>
                <span className="code-string">
                  '{item}'
                </span>

                {i < s.items.length - 1
                  ? ', '
                  : ''}
              </span>
            ))}

            ],
          </div>
        ))}

        {'}'}
      </div>
    </section>
  );
}

export default Skills;
