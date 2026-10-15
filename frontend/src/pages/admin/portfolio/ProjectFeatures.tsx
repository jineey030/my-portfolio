import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefresh } from '../../../api/adminRefresh';

interface ProjectFeature {
  id: number;
  name: string;
}

interface ProjectFeaturesProps {
  projectId: number;
}

function ProjectFeatures({
  projectId
}: ProjectFeaturesProps) {
  const [features, setFeatures] =
    useState<ProjectFeature[]>([]);

  const [featureName, setFeatureName] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAdding, setIsAdding] =
    useState(false);

  const [deletingFeatureId, setDeletingFeatureId] =
    useState<number | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchFeatures = async () => {
    try {
      setError('');

      const response = await apiFetch(
        `/api/projects/${projectId}/features`
      );

      if (!response.ok) {
        throw new Error(
          'Project Features 조회에 실패했습니다.'
        );
      }

      const data: ProjectFeature[] =
        await response.json();

      setFeatures(data);
    } catch (error) {
      console.error(error);

      setError(
        'Features를 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [projectId]);

  useAdminRefresh(fetchFeatures);

  const handleAddFeature = async () => {
    // 추가 중에 Enter를 연타해도 중복 요청하지 않음
    if (isAdding) {
      return;
    }

    const name = featureName.trim();

    if (!name) {
      setError(
        'Feature 이름을 입력해주세요.'
      );
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/features`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Feature 추가에 실패했습니다.'
        );
      }

      setFeatureName('');

      setMessage(
        'Feature가 추가되었습니다.'
      );

      await fetchFeatures();
    } catch (error) {
      console.error(error);

      setError(
        'Feature 추가에 실패했습니다.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteFeature = async (
    feature: ProjectFeature
  ) => {
    const confirmed = window.confirm(
      `"${feature.name}" Feature를 삭제하시겠습니까?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingFeatureId(feature.id);
      setError('');
      setMessage('');

      const response = await apiFetch(
        `/api/projects/${projectId}/features/${feature.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error(
          'Feature 삭제에 실패했습니다.'
        );
      }

      setMessage(
        'Feature가 삭제되었습니다.'
      );

      await fetchFeatures();
    } catch (error) {
      console.error(error);

      setError(
        'Feature 삭제에 실패했습니다.'
      );
    } finally {
      setDeletingFeatureId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-project-features">
        <p>Features를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="admin-project-features">

      <div className="admin-project-features-header">
        <h3>Features</h3>
      </div>

      {error && (
        <p className="admin-form-error">
          {error}
        </p>
      )}

      {message && (
        <p className="admin-form-message">
          {message}
        </p>
      )}

      <div className="admin-project-features-list">
        {features.length === 0 ? (
          // 불러오기에 실패한 경우에는 "없음" 문구를 표시하지 않음
          !error && (
            <p>
              등록된 Feature가 없습니다.
            </p>
          )
        ) : (
          features.map((feature) => (
            <div
              key={feature.id}
              className="admin-project-feature-item"
            >
              <span>{feature.name}</span>

              <button
                type="button"
                onClick={() =>
                  handleDeleteFeature(feature)
                }
                disabled={
                  deletingFeatureId === feature.id
                }
              >
                {deletingFeatureId === feature.id
                  ? 'Deleting...'
                  : 'Remove'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="admin-project-features-add">
        <input
          type="text"
          value={featureName}
          onChange={(event) => {
            setFeatureName(event.target.value);

            // 다시 입력하기 시작하면 이전 안내 문구 제거
            setError('');
            setMessage('');
          }}
          onKeyDown={(event) => {
            // 한글 조합 중 Enter는 무시 (마지막 글자 중복 입력 방지)
            if (
              event.key === 'Enter' &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleAddFeature();
            }
          }}
          placeholder="예: Todo CRUD"
        />

        <button
          type="button"
          onClick={handleAddFeature}
          disabled={isAdding}
        >
          {isAdding
            ? 'Adding...'
            : 'Add Feature'}
        </button>
      </div>

    </div>
  );
}

export default ProjectFeatures;
