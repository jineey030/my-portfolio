import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { PROJECTS } from '../introduce/constants/projects';
import './ProjectDetail.css';

interface Skill {
  id: number;
  name: string;
}

function ProjectDetail() {
  const { projectId } = useParams();

  const project = PROJECTS.find(
    (p) => p.id === projectId
  );

  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (!project) return;

    const fetchSkills = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/projects/${project.backendId}/skills`
        );

        if (!response.ok) {
          throw new Error('Skills를 불러오지 못했습니다.');
        }

        const data: Skill[] = await response.json();

        setSkills(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSkills();
  }, [project]);

  if (!project) {
    return (
      <main className="project-detail project-not-found">
        <p>프로젝트를 찾을 수 없습니다.</p>

        <Link to="/">
          ← 홈으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="project-detail">
      {/* Header */}
      <header className="project-detail-header">
        <p className="project-detail-label">
          PROJECT / {project.id}
        </p>

        <h1>{project.title}</h1>

        <p className="project-detail-description">
          {project.description}
        </p>
      </header>

      {/* Tech Stack */}
      <section className="project-detail-section">
        <p className="project-section-label">
          01 / TECH STACK
        </p>

        <div className="stack-tags">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="stack-tag"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="project-detail-section">
        <p className="project-section-label">
          02 / FEATURES
        </p>

        <ul className="project-detail-list">
          {project.features.map((feature) => (
            <li key={feature}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Role */}
      <section className="project-detail-section">
        <p className="project-section-label">
          03 / MY ROLE
        </p>

        <p className="project-detail-text">
          {project.role}
        </p>
      </section>

      {/* Challenges */}
      <section className="project-detail-section">
        <p className="project-section-label">
          04 / CHALLENGES
        </p>

        <ul className="project-detail-list">
          {project.challenges.map((challenge) => (
            <li key={challenge}>
              {challenge}
            </li>
          ))}
        </ul>
      </section>

      {/* Technical Highlights */}
      <section className="project-detail-section">
        <p className="project-section-label">
          05 / TECHNICAL HIGHLIGHTS
        </p>

        <div className="technical-highlights">
          {project.technicalHighlights.map(
            (highlight) => (
              <article
                key={highlight.title}
                className="technical-highlight"
              >
                <h3>{highlight.title}</h3>

                <p>{highlight.description}</p>
              </article>
            )
          )}
        </div>
      </section>

      {/* Links */}
      <section className="project-detail-links">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        )}

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
          >
            Live Demo ↗
          </a>
        )}
      </section>

      {/* Back */}
      <Link
        to="/#projects"
        className="project-back"
      >
        ← 프로젝트 목록으로 돌아가기
      </Link>
    </main>
  );
}

export default ProjectDetail;
