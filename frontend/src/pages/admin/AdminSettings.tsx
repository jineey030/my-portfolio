import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';

interface AdminProfile {
  username: string;
  role: string;
}

function AdminSettings() {
  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError('');

        const response = await apiFetch(
          '/api/admin/profile'
        );

        if (!response.ok) {
          throw new Error(
            '관리자 정보를 불러오지 못했습니다.'
          );
        }

        const data =
          await response.json();

        setProfile(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '관리자 정보를 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <p className="admin-recent-label">
            ADMIN
          </p>
          <h1>Settings</h1>
        </div>

        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <p className="admin-recent-label">
            ADMIN
          </p>
          <h1>Settings</h1>
        </div>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <p className="admin-recent-label">
          ADMIN
        </p>

        <h1>Settings</h1>

        <p>
          관리자 계정 정보를 관리합니다.
        </p>
      </div>

      <section className="admin-settings-section">
        <h2>Profile</h2>

        <div className="admin-settings-info">
          <div>
            <span>Username</span>
            <strong>
              {profile?.username}
            </strong>
          </div>

          <div>
            <span>Role</span>
            <strong>
              {profile?.role}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminSettings;