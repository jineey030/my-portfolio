import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import SectionTitle from '../../../components/ui/SectionTitle';
import Tag from '../../../components/ui/Tag';
import type { Project, Skill } from '../../../types/project';
import { apiFetch } from '../../../api/api';

interface ProjectWithSkills extends Project {
  // null = 아직 불러오는 중
  skills: Skill[] | null;
}

// 로딩 중에 보여줄 스켈레톤 카드 개수 (2열 그리드 한 줄)
const SKELETON_CARD_COUNT = 2;

function ProjectCardSkeleton() {
  return (
    <div
      className="project-card project-card-skeleton"
      aria-hidden="true"
    >
      <div className="skeleton">
        <span className="skeleton-line project-skeleton-title" />
        <span className="skeleton-line project-skeleton-text" />
        <span className="skeleton-line project-skeleton-text" />
        <span className="skeleton-line project-skeleton-text" />
      </div>

      <div className="project-skeleton-tags">
        <span className="skeleton-line project-skeleton-tag" />
        <span className="skeleton-line project-skeleton-tag" />
        <span className="skeleton-line project-skeleton-tag" />
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState<ProjectWithSkills[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 화면을 빨리 벗어나도 끝난 요청이 상태를 바꾸지 않도록
    let active = true;

    const fetchProjects = async () => {
      let data: Project[];

      // 1. 프로젝트 목록 가져오기
      try {
        const response = await apiFetch(
          '/api/projects'
        );

        if (!response.ok) {
          throw new Error('프로젝트 목록을 불러오지 못했습니다.');
        }

        data = await response.json();
      } catch (error) {
        console.error(error);

        if (active) {
          setHasError(true);
          setIsLoading(false);
        }

        return;
      }

      if (!active) {
        return;
      }

      // 목록이 오면 카드를 먼저 보여주고, Skills는 뒤이어 채운다
      setProjects(
        data.map((project) => ({
          ...project,
          skills: null
        }))
      );
      setIsLoading(false);

      // 2. 각 프로젝트의 Skills 가져오기
      // 한 프로젝트가 실패해도 다른 프로젝트 카드에는 영향이 없도록 각각 처리
      await Promise.all(
        data.map(async (project) => {
          let skills: Skill[] = [];

          try {
            const skillResponse = await apiFetch(
              `/api/projects/${project.id}/skills`
            );

            if (!skillResponse.ok) {
              throw new Error(
                `Skills를 불러오지 못했습니다. projectId: ${project.id}`
              );
            }

            skills = await skillResponse.json();
          } catch (error) {
            console.error(error);
          }

          if (!active) {
            return;
          }

          setProjects((current) =>
            current.map((item) =>
              item.id === project.id
                ? { ...item, skills }
                : item
            )
          );
        })
      );
    };

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          className="project-grid"
          role="status"
          aria-label="프로젝트를 불러오는 중"
        >
          {Array.from(
            { length: SKELETON_CARD_COUNT },
            (_, index) => (
              <ProjectCardSkeleton key={index} />
            )
          )}
        </div>
      );
    }

    if (hasError) {
      return (
        <p className="projects-message">
          프로젝트를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.
        </p>
      );
    }

    if (projects.length === 0) {
      return (
        <p className="projects-message">
          프로젝트가 아직 등록되지 않았습니다.
        </p>
      );
    }

    return (
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

              <span
                className="project-arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>

            <p className="project-description">
              {project.description}
            </p>

            {project.skills === null ? (
              // Skills만 아직 불러오는 중: 태그 자리에 스켈레톤
              <div
                className="project-stack"
                aria-hidden="true"
              >
                <span className="skeleton-line project-skeleton-tag" />
                <span className="skeleton-line project-skeleton-tag" />
                <span className="skeleton-line project-skeleton-tag" />
              </div>
            ) : (
              project.skills.length > 0 && (
                <div className="project-stack">
                  {project.skills.map((skill) => (
                    <Tag key={skill.id}>
                      {skill.name}
                    </Tag>
                  ))}
                </div>
              )
            )}

            <span className="project-view">
              View Project →
            </span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <section id="projects" aria-busy={isLoading}>
      <SectionTitle>Projects</SectionTitle>

      {renderContent()}
    </section>
  );
}

export default Projects;
