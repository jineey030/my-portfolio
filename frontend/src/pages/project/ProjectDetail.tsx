import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { PROJECTS } from '../introduce/constants/projects';
import './ProjectDetail.css';

interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl: string | null;
  deployUrl: string | null;
  imageUrl: string | null;
}

interface Skill {
  id: number;
  name: string;
}

function ProjectDetail() {
  const { projectId } = useParams();

  const projectConfig = PROJECTS.find(
    (project) => project.id === projectId
  );

  const [project, setProject] = useState<Project | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (!projectConfig) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/projects/${projectConfig.backendId}`
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
  }, [projectConfig]);

  useEffect(() => {
    if (!projectConfig) return;

    const fetchSkills = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/projects/${projectConfig.backendId}/skills`
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
  }, [projectConfig]);

  if (!projectConfig) {
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
