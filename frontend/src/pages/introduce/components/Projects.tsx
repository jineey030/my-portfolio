import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import SectionTitle from '../../../components/ui/SectionTitle';
import Tag from '../../../components/ui/Tag';
import type { Project } from '../../../types/project';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/projects'
        );

        if (!response.ok) {
          throw new Error('프로젝트 목록을 불러오지 못했습니다.');
        }

        const data: Project[] = await response.json();

        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects">
      <SectionTitle>Projects</SectionTitle>

      <div className="project-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.slug}`}
            className="project-card"
          >
            <div className="project-card-header">
              <h3 className="project-title">
                {project.name}
              </h3>

              <span className="project-arrow">
                ↗
              </span>
            </div>

            <p className="project-description">
              {project.description}
            </p>

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
