import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import SectionTitle from '../../../components/ui/SectionTitle';
import Tag from '../../../components/ui/Tag';
import type { Project, Skill } from '../../../types/project';

interface ProjectWithSkills extends Project {
  skills: Skill[];
}

function Projects() {
  const [projects, setProjects] = useState<ProjectWithSkills[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 1. 프로젝트 목록 가져오기
        const response = await fetch(
          'http://localhost:8080/api/projects'
        );

        if (!response.ok) {
          throw new Error('프로젝트 목록을 불러오지 못했습니다.');
        }

        const data: Project[] = await response.json();

        // 2. 각 프로젝트의 Skills 가져오기
        const projectsWithSkills = await Promise.all(
          data.map(async (project) => {
            const skillResponse = await fetch(
              `http://localhost:8080/api/projects/${project.id}/skills`
            );

            if (!skillResponse.ok) {
              throw new Error(
                `Skills를 불러오지 못했습니다. projectId: ${project.id}`
              );
            }

            const skills: Skill[] = await skillResponse.json();

            return {
              ...project,
              skills,
            };
          })
        );

        setProjects(projectsWithSkills);
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

            <div className="project-stack">
              {project.skills.map((skill) => (
                <Tag key={skill.id}>
                  {skill.name}
                </Tag>
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
