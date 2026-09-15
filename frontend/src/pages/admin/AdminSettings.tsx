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

  const [isAccountOpen, setIsAccountOpen] =
    useState(false);

  const [isPasswordOpen, setIsPasswordOpen] =
    useState(false);

  // admin profile 변경 - username
  const [newUsername, setNewUsername] =
    useState('');

  const [isSavingUsername, setIsSavingUsername] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  // admin profile 변경 - password
  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

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

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      setError('⚠️ Username을 입력해주세요.');
      return;
    }

    if (newUsername === profile?.username) {
      setError('⚠️ 현재 Username과 동일합니다.');
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      setIsSavingUsername(true);

      const response = await apiFetch(
        '/api/admin/profile',
        {
          method: 'PUT',
          body: JSON.stringify({
            username: newUsername.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Username 변경에 실패했습니다.'
        );
      }

      localStorage.setItem(
        'admin_token',
        data.token
      );

      setProfile({
        username: data.username,
        role: data.role,
      });

      setNewUsername('');

      setSuccessMessage(
        '👤 Username이 성공적으로 변경되었습니다.'
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '❌ Username 변경에 실패했습니다.'
      );
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccessMessage('');

    if (!currentPassword) {
      setError('⚠️ 현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!newPassword) {
      setError('⚠️ 새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 8) {
      setError('⚠️ 새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('❌ 새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await apiFetch(
        '/api/admin/profile/password',
        {
          method: 'PUT',
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        let message =
          '비밀번호 변경에 실패했습니다.';

        try {
          const data = await response.json();

          if (data.message) {
            message = data.message;
          }
        } catch {
          // 응답 본문이 없는 경우 기본 메시지 사용
        }

        throw new Error(message);
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setSuccessMessage(
        '🔐 비밀번호가 성공적으로 변경되었습니다.'
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '비밀번호 변경에 실패했습니다.'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

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

      {error && (
        <p className="admin-settings-error">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="admin-settings-success">
          {successMessage}
        </p>
      )}

      <section className="admin-settings-section">
        <button
          type="button"
          className="admin-settings-accordion"
          onClick={() =>
            setIsAccountOpen((prev) => !prev)
          }
          aria-expanded={isAccountOpen}
        >
          <span>Account Change</span>
          <span
            className={`admin-settings-arrow ${
              isAccountOpen ? 'open' : ''
            }`}
          >
            ›
          </span>
        </button>

        {isAccountOpen && (
          <div className="admin-settings-accordion-content">
            <div className="admin-settings-form">
              <label>
                <span>New Username</span>

                <input
                  type="text"
                  value={newUsername}
                  onChange={(event) =>
                    setNewUsername(event.target.value)
                  }
                  placeholder={profile?.username}
                />
              </label>

              <button
                type="button"
                onClick={handleUpdateUsername}
                disabled={isSavingUsername}
              >
                {isSavingUsername
                  ? 'Saving...'
                  : 'Save Username'}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="admin-settings-section">
        <button
          type="button"
          className="admin-settings-accordion"
          onClick={() =>
            setIsPasswordOpen((prev) => !prev)
          }
          aria-expanded={isPasswordOpen}
        >
          <span>Password Change</span>
          <span
            className={`admin-settings-arrow ${
              isPasswordOpen ? 'open' : ''
            }`}
          >
            ›
          </span>
        </button>

        {isPasswordOpen && (
          <div className="admin-settings-accordion-content">
            <div className="admin-settings-form">
              <label>
                <span>Current Password</span>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />
              </label>

              <label>
                <span>New Password</span>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  autoComplete="new-password"
                />
              </label>

              <label>
                <span>Confirm New Password</span>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                />
              </label>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword
                  ? 'Changing...'
                  : 'Change Password'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminSettings;
