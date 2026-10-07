import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import type { Project } from '../../../types/project';

import ProjectSkills from './ProjectSkills';
import ProjectFeatures from './ProjectFeatures';
import ProjectChallenges from './ProjectChallenges';
import ProjectTechnicalHighlights from './ProjectTechnicalHighlights';

function PortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] =
    useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    githubUrl: '',
    deployUrl: '',
    imageUrl: '',
    role: ''
  });

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
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

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm({
      ...form,
      [field]: value
    });

    setMessage('');
    setError('');
  };

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      description: '',
      githubUrl: '',
      deployUrl: '',
      imageUrl: '',
      role: ''
    });

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

            setMessage('프로젝트가 삭제되었습니다.');

            await fetchProjects();
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

    try {
      setIsSaving(true);
      setMessage('');
      setError('');

      const isEditing =
        editingProjectId !== null;

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

      await fetchProjects();
    } catch (error) {
      console.error(error);

      setError(
        editingProjectId !== null
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
          <p>
            등록된 프로젝트가 없습니다.
          </p>
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

              <ProjectSkills
                projectId={project.id}
              />

              <ProjectFeatures
                projectId={project.id}
              />

              <ProjectChallenges
                projectId={project.id}
              />

              <ProjectTechnicalHighlights
                projectId={project.id}
              />

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
