import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { apiFetch } from '../../api/api';
// CSS는 main.tsx에서 한 번에 불러온다. (ProjectDetail.css)
import type {
  Project,
  Skill,
  Feature,
  Challenge,
  TechnicalHighlight
} from '../../types/project';

type LoadState = 'loading' | 'loaded' | 'not-found' | 'error';

interface ProjectDetailData {
  project: Project;
  skills: Skill[];
  features: Feature[];
  challenges: Challenge[];
  technicalHighlights: TechnicalHighlight[];
}

const SITE_TITLE = 'YEJIN | Portfolio';

/**
 * 목록 API를 불러온다. 실패해도 빈 배열을 돌려줘서
 * 한 섹션이 실패해도 상세 페이지 전체가 깨지지 않게 한다.
 */
async function fetchList<T>(url: string): Promise<T[]> {
  try {
    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`${url} 조회 실패: ${response.status}`);
    }

    return (await response.json()) as T[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function ProjectDetailSkeleton() {
  return (
    <main
      className="project-detail"
      aria-busy="true"
    >
      <div
        className="skeleton project-detail-skeleton"
        role="status"
        aria-label="프로젝트를 불러오는 중"
      >
        <span className="skeleton-line project-detail-skeleton-label" />
        <span className="skeleton-line project-detail-skeleton-title" />
        <span className="skeleton-line project-detail-skeleton-text" />
        <span className="skeleton-line project-detail-skeleton-text" />
      </div>
    </main>
  );
}

function ProjectDetail() {
  // 라우트 이름은 :projectId지만 실제 값은 프로젝트 slug
  const { projectId: slug } = useParams();

  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    if (!slug) {
      setLoadState('not-found');
      return;
    }

    // 다른 프로젝트로 이동했을 때 이전 응답이 늦게 도착해도 무시
    let active = true;

    // 다른 프로젝트로 이동하면 이전 프로젝트 내용을 지우고 다시 로딩 표시
    setData(null);
    setLoadState('loading');

    const fetchDetail = async () => {
      try {
        const response = await apiFetch(
          `/api/projects/slug/${encodeURIComponent(slug)}`
        );

        if (response.status === 404) {
          if (active) setLoadState('not-found');
          return;
        }

        if (!response.ok) {
          throw new Error('프로젝트를 불러오지 못했습니다.');
        }

        const project: Project = await response.json();

        // 프로젝트를 받은 뒤 나머지 4개는 동시에 불러온다
        const [
          skills,
          features,
          challenges,
          technicalHighlights
        ] = await Promise.all([
          fetchList<Skill>(`/api/projects/${project.id}/skills`),
          fetchList<Feature>(`/api/projects/${project.id}/features`),
          fetchList<Challenge>(`/api/projects/${project.id}/challenges`),
          fetchList<TechnicalHighlight>(
            `/api/projects/${project.id}/technical-highlights`
          )
        ]);

        if (!active) return;

        setData({
          project,
          skills,
          features,
          challenges,
          technicalHighlights
        });
        setLoadState('loaded');
      } catch (error) {
        console.error(error);

        if (active) setLoadState('error');
      }
    };

    fetchDetail();

    return () => {
      active = false;
    };
  }, [slug]);

  // 브라우저 탭 제목에 프로젝트 이름 표시
  useEffect(() => {
    if (data?.project.name) {
      document.title = `${data.project.name} | YEJIN`;
    }

    return () => {
      document.title = SITE_TITLE;
    };
  }, [data?.project.name]);

  if (loadState === 'loading') {
    return <ProjectDetailSkeleton />;
  }

  if (loadState === 'not-found' || loadState === 'error' || !data) {
    return (
      <main className="project-detail project-not-found">
        <p>
          {loadState === 'error'
            ? '프로젝트를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'
            : '프로젝트를 찾을 수 없습니다.'}
        </p>

        <Link to="/#projects">
          ← 프로젝트 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const {
    project,
    skills,
    features,
    challenges,
    technicalHighlights
  } = data;

  const role = project.role?.trim();

  // 내용이 있는 섹션만 보여주고, 번호도 보이는 순서대로 다시 매긴다
  const sections = [
    {
      key: 'stack',
      label: 'TECH STACK',
      visible: skills.length > 0,
      content: (
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
      )
    },
    {
      key: 'features',
      label: 'FEATURES',
      visible: features.length > 0,
      content: (
        <ul className="project-detail-list">
          {features.map((feature) => (
            <li key={feature.id}>
              {feature.name}
            </li>
          ))}
        </ul>
      )
    },
    {
      key: 'role',
      label: 'MY ROLE',
      visible: Boolean(role),
      content: (
        <p className="project-detail-text">
          {role}
        </p>
      )
    },
    {
      key: 'challenges',
      label: 'CHALLENGES',
      visible: challenges.length > 0,
      content: (
        <ul className="project-detail-list">
          {challenges.map((challenge) => (
            <li key={challenge.id}>
              {challenge.name}
            </li>
          ))}
        </ul>
      )
    },
    {
      key: 'highlights',
      label: 'TECHNICAL HIGHLIGHTS',
      visible: technicalHighlights.length > 0,
      content: (
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
      )
    }
  ].filter((section) => section.visible);

  const hasLinks = Boolean(project.githubUrl || project.deployUrl);

  return (
    <main className="project-detail">
      <header className="project-detail-header">
        <p className="project-detail-label">
          PROJECT / {project.slug}
        </p>

        <h1>{project.name}</h1>

        <p className="project-detail-description">
          {project.description}
        </p>
      </header>

      {sections.map((section, index) => (
        <section
          key={section.key}
          className="project-detail-section"
        >
          <p className="project-section-label">
            {String(index + 1).padStart(2, '0')} / {section.label}
          </p>

          {section.content}
        </section>
      ))}

      {/* 링크가 하나도 없으면 빈 영역을 만들지 않는다 */}
      {hasLinks && (
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
      )}

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
