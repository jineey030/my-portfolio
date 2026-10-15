import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefresh } from '../../../api/adminRefresh';
import type { Project } from '../../../types/project';

import ProjectSkills from './ProjectSkills';
import ProjectFeatures from './ProjectFeatures';
import ProjectChallenges from './ProjectChallenges';
import ProjectTechnicalHighlights from './ProjectTechnicalHighlights';

// 프로젝트 콘텐츠 아코디언 섹션 목록
// 섹션을 추가할 때는 여기에 한 줄만 추가하면 된다.
const CONTENT_SECTIONS = [
  { key: 'skills', label: 'Skills', Component: ProjectSkills },
  { key: 'features', label: 'Features', Component: ProjectFeatures },
  { key: 'challenges', label: 'Challenges', Component: ProjectChallenges },
  {
    key: 'technical-highlights',
    label: 'Technical Highlights',
    Component: ProjectTechnicalHighlights
  }
] as const;

type ContentSectionKey = (typeof CONTENT_SECTIONS)[number]['key'];

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  githubUrl: '',
  deployUrl: '',
  imageUrl: '',
  role: ''
};

function PortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] =
    useState<number | null>(null);

  // 열려 있는 아코디언 목록 ("프로젝트ID:섹션" 형태로 저장)
  // 여러 개를 동시에 펼칠 수 있다.
  const [openContents, setOpenContents] =
    useState<Set<string>>(() => new Set());

  const [form, setForm] = useState(EMPTY_FORM);

  const formRef = useRef<HTMLFormElement>(null);

  const getContentKey = (
    projectId: number,
    section: ContentSectionKey
  ) => `${projectId}:${section}`;

  const isContentOpen = (
    projectId: number,
    section: ContentSectionKey
  ) => openContents.has(getContentKey(projectId, section));

  const toggleContent = (
    projectId: number,
    section: ContentSectionKey
  ) => {
    const key = getContentKey(projectId, section);

    setOpenContents((current) => {
      // Set은 직접 수정하면 React가 변경을 감지하지 못하므로 복사본을 만든다.
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const fetchProjects = async (
    { silent = false }: { silent?: boolean } = {}
  ) => {
    try {
      if (!silent) setIsLoading(true);
      setError('');

      const response = await apiFetch(
        '/api/projects'
      );

      if (!response.ok) {
        throw new Error(
          '프로젝트를 불러오지 못했습니다.'
        );
      }

      const data: Project[] =
        await response.json();

      setProjects(data);
    } catch (error) {
      console.error(error);

      setError(
        '프로젝트를 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 데이터 추가/수정/삭제 후 화면 자동 새로고침 (열린 패널은 유지)
  useAdminRefresh(() => fetchProjects({ silent: true }));

  // 폼이 열리거나 다른 프로젝트를 수정하기 시작하면 폼으로 스크롤
  useEffect(() => {
    if (isFormOpen) {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isFormOpen, editingProjectId]);

  const handleChange = (
    field: keyof typeof EMPTY_FORM,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));

    setMessage('');
    setError('');
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingProjectId(null);
  };

  const handleCreateClick = () => {
    resetForm();

    setMessage('');
    setError('');

    setIsFormOpen(true);
  };

  const handleEditClick = (
    project: Project
  ) => {
    setForm({
      name: project.name,
      slug: project.slug,
      description: project.description,
      githubUrl: project.githubUrl ?? '',
      deployUrl: project.deployUrl ?? '',
      imageUrl: project.imageUrl ?? '',
      role: project.role ?? ''
    });

    setEditingProjectId(project.id);

    setMessage('');
    setError('');

    setIsFormOpen(true);
  };

  const handleDelete = async (
    project: Project
  ) => {
    const confirmed = window.confirm(
      `"${project.name}" 프로젝트를 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage('');
      setError('');

      const response = await apiFetch(
        `/api/projects/${project.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error(
          '프로젝트 삭제에 실패했습니다.'
        );
      }

      // 수정 중이던 프로젝트를 삭제했다면 폼 닫기
      if (editingProjectId === project.id) {
        resetForm();
        setIsFormOpen(false);
      }

      // 삭제한 프로젝트의 열린 아코디언 정리
      setOpenContents((current) => {
        const next = new Set(current);

        for (const key of current) {
          if (key.startsWith(`${project.id}:`)) {
            next.delete(key);
          }
        }

        return next;
      });

      setMessage('프로젝트가 삭제되었습니다.');

      await fetchProjects({ silent: true });
    } catch (error) {
      console.error(error);

      setError(
        '프로젝트 삭제에 실패했습니다.'
      );
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const isEditing =
      editingProjectId !== null;

    try {
      setIsSaving(true);
      setMessage('');
      setError('');

      const url = isEditing
        ? `/api/projects/${editingProjectId}`
        : '/api/projects';

      const method = isEditing
        ? 'PUT'
        : 'POST';

      const response = await apiFetch(
        url,
        {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            description: form.description,
            githubUrl: form.githubUrl || null,
            deployUrl: form.deployUrl || null,
            imageUrl: form.imageUrl || null,
            role: form.role || null
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing
            ? '프로젝트 수정에 실패했습니다.'
            : '프로젝트 생성에 실패했습니다.'
        );
      }

      resetForm();
      setIsFormOpen(false);

      setMessage(
        isEditing
          ? '프로젝트가 수정되었습니다.'
          : '프로젝트가 생성되었습니다.'
      );

      await fetchProjects({ silent: true });
    } catch (error) {
      console.error(error);

      setError(
        isEditing
          ? '프로젝트 수정에 실패했습니다.'
          : '프로젝트 생성에 실패했습니다.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseForm = () => {
    resetForm();

    setIsFormOpen(false);
    setMessage('');
    setError('');
  };

  if (isLoading) {
    return (
      <main className="admin-page">
        <p>프로젝트를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="admin-page-label">
          ADMIN / PORTFOLIO / PROJECTS
        </p>

        <h1>Portfolio Projects</h1>

        <p className="admin-page-description">
          포트폴리오에 표시되는 프로젝트를 관리합니다.
        </p>
      </header>

      <div className="admin-page-actions">
        <button
          type="button"
          onClick={handleCreateClick}
        >
          + New Project
        </button>
      </div>

      {isFormOpen && (
        <form
          ref={formRef}
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form-group">
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                handleChange(
                  'name',
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="slug">
              Slug
            </label>

            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(event) =>
                handleChange(
                  'slug',
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(event) =>
                handleChange(
                  'description',
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="githubUrl">
              GitHub URL
            </label>

            <input
              id="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={(event) =>
                handleChange(
                  'githubUrl',
                  event.target.value
                )
              }
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="deployUrl">
              Deploy URL
            </label>

            <input
              id="deployUrl"
              type="url"
              value={form.deployUrl}
              onChange={(event) =>
                handleChange(
                  'deployUrl',
                  event.target.value
                )
              }
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="imageUrl">
              Image URL
            </label>

            <input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(event) =>
                handleChange(
                  'imageUrl',
                  event.target.value
                )
              }
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="role">
              Role
            </label>

            <input
              id="role"
              type="text"
              value={form.role}
              onChange={(event) =>
                handleChange(
                  'role',
                  event.target.value
                )
              }
              placeholder="Frontend / Backend"
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? 'Saving...'
                : editingProjectId !== null
                  ? 'Save Changes'
                  : 'Create Project'}
            </button>

            <button
              type="button"
              onClick={handleCloseForm}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="admin-form-message">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-form-error">
          {error}
        </p>
      )}

      <section className="admin-project-list">
        {projects.length === 0 ? (
          // 불러오기에 실패한 경우에는 "없음" 문구를 표시하지 않음
          !error && (
            <p>
              등록된 프로젝트가 없습니다.
            </p>
          )
        ) : (
          projects.map((project) => (
            <article
              key={project.id}
              className="admin-project-card"
            >
              <div>
                <p className="admin-project-card-label">
                  PROJECT
                </p>

                <h2>{project.name}</h2>

                <p>{project.description}</p>

                <span>{project.slug}</span>
              </div>

              <div className="admin-project-content">
                <p className="admin-project-content-label">
                  PROJECT CONTENT
                </p>

                {CONTENT_SECTIONS.map(
                  ({ key, label, Component }) => {
                    const isOpen = isContentOpen(
                      project.id,
                      key
                    );

                    return (
                      <div
                        key={key}
                        className="admin-project-content-section"
                      >
                        <button
                          type="button"
                          className="admin-project-content-toggle"
                          onClick={() =>
                            toggleContent(project.id, key)
                          }
                          aria-expanded={isOpen}
                        >
                          <span>{label}</span>

                          <span className="admin-project-content-arrow">
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="admin-project-content-body">
                            <Component
                              projectId={project.id}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              <div className="admin-project-card-actions">
                <button
                  type="button"
                  onClick={() =>
                    handleEditClick(project)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(project)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default PortfolioProjects;
