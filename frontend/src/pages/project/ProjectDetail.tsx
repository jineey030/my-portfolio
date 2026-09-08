import { Link, useParams } from 'react-router';
import { PROJECTS } from '../introduce/constants/projects';

function ProjectDetail() {
  const { projectId } = useParams();

  const project = PROJECTS.find(
    (p) => p.id === projectId
  );

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <main className="project-detail">
      {/* 프로젝트 제목 */}
      <header className="project-detail-header">
        <h1>{project.title}</h1>

        <p>{project.description}</p>
      </header>

      {/* 기술 스택 */}
      <section>
        <h2>Tech Stack</h2>

        <div className="stack-tags">
          {project.stack.map((stack) => (
            <span
              key={stack}
              className="stack-tag"
            >
              {stack}
            </span>
          ))}
        </div>
      </section>

      {/* 주요 기능 */}
      <section>
        <h2>주요 기능</h2>

        <ul>
          {project.features.map((feature) => (
            <li key={feature}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* 담당 역할 */}
      <section>
        <h2>담당한 역할</h2>

        <p>{project.role}</p>
      </section>

      {/* 개발하면서 해결한 문제 */}
      <section>
        <h2>Challenges</h2>

        <ul>
          {project.challenges.map((challenge) => (
            <li key={challenge}>
              {challenge}
            </li>
          ))}
        </ul>
      </section>

      {/* GitHub / Demo 링크 */}
      <section className="project-detail-links">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        )}

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
          >
            Live Demo
          </a>
        )}
      </section>

      {/* 프로젝트 목록으로 돌아가기 */}
      <Link to="/#projects">
        ← 프로젝트 목록으로 돌아가기
      </Link>
    </main>
  );
}

export default ProjectDetail;
