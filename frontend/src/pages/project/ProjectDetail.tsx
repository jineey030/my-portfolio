import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import './ProjectDetail.css';
import type {
  Project,
  Skill,
  Feature,
  Challenge,
  TechnicalHighlight
} from '../../types/project'
function ProjectDetail() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [technicalHighlights, setTechnicalHighlights] = useState<TechnicalHighlight[]>([]);

  // projects
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/projects/slug/${projectId}`
        );

        if (!response.ok) {
          throw new Error('프로젝트를 불러오지 못했습니다.');
        }

        const data: Project = await response.json();

        setProject(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProject();
  }, [projectId]);

  // feature
  useEffect(() => {
    if (!project?.id) return;

    const fetchFeatures = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/projects/${project.id}/features`
        );

        if (!response.ok) {
          throw new Error('Features를 불러오지 못했습니다.');
        }

        const data: Feature[] = await response.json();

        setFeatures(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeatures();
  }, [project?.id]);
// skills
useEffect(() => {
  if (!project?.id) return;

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${project.id}/skills`
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
}, [project?.id]);

// challenge
useEffect(() => {
  if (!project?.id) return;

  const fetchChallenges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${project.id}/challenges`
      );

      if (!response.ok) {
        throw new Error('Challenges를 불러오지 못했습니다.');
      }

      const data: Challenge[] = await response.json();

      setChallenges(data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchChallenges();
}, [project?.id]);

//slug
useEffect(() => {
  if (!project?.id) return;

  const fetchTechnicalHighlights = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${project.id}/technical-highlights`
      );

      if (!response.ok) {
        throw new Error(
          'Technical Highlights를 불러오지 못했습니다.'
        );
      }

      const data: TechnicalHighlight[] = await response.json();

      setTechnicalHighlights(data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchTechnicalHighlights();
}, [project?.id]);

  if (!projectId) {
  return (
    <main className="project-detail project-not-found">
      <p>프로젝트를 찾을 수 없습니다.</p>

      <Link to="/">
        ← 홈으로 돌아가기
      </Link>
    </main>
  );
}

  if (!project) {
    return (
      <main className="project-detail">
        <p>프로젝트를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="project-detail">
      <header className="project-detail-header">
        <p className="project-detail-label">
          PROJECT / {project.id}
        </p>

        <h1>{project.name}</h1>

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
          {features.map((feature) => (
            <li key={feature.id}>
              {feature.name}
            </li>
          ))}
        </ul>
      </section>

      {/* My Role */}
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
          {challenges.map((challenge) => (
            <li key={challenge.id}>
              {challenge.name}
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
          {technicalHighlights.map((highlight) => (
            <article
              key={highlight.id}
              className="technical-highlight"
            >
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="project-detail-links">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        )}

        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noreferrer"
          >
            Live Demo ↗
          </a>
        )}
      </section>

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
