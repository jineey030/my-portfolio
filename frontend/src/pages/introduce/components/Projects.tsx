import { Link } from 'react-router';
import { PROJECTS } from '../constants/projects';

function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>

      <div className="project-grid">
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-card"
          >
            <div className="project-card-header">
              <h3 className="project-title">
                {project.title}
              </h3>

              <span className="project-arrow">
                ↗
              </span>
            </div>

            <p className="project-description">
              {project.description}
            </p>

            <div className="project-stack">
              {project.stack.map((stack) => (
                <span
                  key={stack}
                  className="project-stack-tag"
                >
                  {stack}
                </span>
              ))}
            </div>

            <span className="project-view">
              View Project →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Projects;
