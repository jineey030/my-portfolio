import { Link } from 'react-router';
import { PROJECTS } from '../constants/projects';

function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>

      <div className="project-grid">
        {PROJECTS.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="project-card"
          >
            <h3 className="project-title">
              {p.title}
            </h3>

            <p className="project-desc">
              {p.description}
            </p>

            <div className="stack-tags">
              {p.stack.map((s) => (
                <span key={s} className="stack-tag">
                  {s}
                </span>
              ))}
            </div>

            <span className="project-link-arrow">
              → 자세히 보기
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Projects;
