import { useEffect, useState, type FormEvent } from 'react';
import { apiFetch } from '../../api/api';
import { useAdminRefreshKey } from '../../api/adminRefresh';

// CSS는 main.tsx에서 한 번에 불러온다. (Admin.css)

interface AdminProfile {
  username: string;
  role: string;
}

/**
 * 실패 응답에서 서버가 보낸 message를 꺼낸다.
 * 응답 본문이 비어 있거나 JSON이 아니면 기본 메시지를 쓴다.
 */
async function getErrorMessage(
  response: Response,
  fallback: string
) {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
}

function AdminSettings() {
  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [successMessage, setSuccessMessage] =
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

  // admin profile 변경 - password
  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const refreshKey = useAdminRefreshKey();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch(
          '/api/admin/profile'
        );

        if (!response.ok) {
          throw new Error(
            '관리자 정보를 불러오지 못했습니다.'
          );
        }

        const data: AdminProfile =
          await response.json();

        setProfile(data);
      } catch (error) {
        console.error(error);

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
  }, [refreshKey]);

  // 입력을 다시 시작하면 이전 안내 문구 제거
  const clearNotice = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleUpdateUsername = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSavingUsername) {
      return;
    }

    clearNotice();

    const username = newUsername.trim();

    if (!username) {
      setError('⚠️ Username을 입력해주세요.');
      return;
    }

    if (username === profile?.username) {
      setError('⚠️ 현재 Username과 동일합니다.');
      return;
    }

    try {
      setIsSavingUsername(true);

      const response = await apiFetch(
        '/api/admin/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        }
      );

      // 실패 응답은 본문이 비어 있을 수 있으므로 ok 여부를 먼저 확인
      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            '❌ Username 변경에 실패했습니다.'
          )
        );
      }

      const data: AdminProfile & {
        token?: string;
      } = await response.json();

      // Username이 바뀌면 서버가 새 토큰을 준다. 없으면 기존 토큰 유지
      if (data.token) {
        localStorage.setItem(
          'admin_token',
          data.token
        );
      }

      setProfile({
        username: data.username,
        role: data.role,
      });

      setNewUsername('');

      setSuccessMessage(
        '👤 Username이 성공적으로 변경되었습니다.'
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : '❌ Username 변경에 실패했습니다.'
      );
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isChangingPassword) {
      return;
    }

    clearNotice();

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

    if (newPassword === currentPassword) {
      setError('⚠️ 새 비밀번호가 현재 비밀번호와 같습니다.');
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            '비밀번호 변경에 실패했습니다.'
          )
        );
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setSuccessMessage(
        '🔐 비밀번호가 성공적으로 변경되었습니다.'
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : '비밀번호 변경에 실패했습니다.'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const pageHeader = (
    <header className="admin-page-header">
      <p className="admin-page-label">
        ADMIN / SETTINGS
      </p>

      <h1>Settings</h1>

      <p className="admin-page-description">
        관리자 계정 정보를 관리합니다.
      </p>
    </header>
  );

  if (isLoading) {
    return (
      <main className="admin-page">
        {pageHeader}
        <p>관리자 정보를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      {pageHeader}

      <section className="admin-settings-section">
        <h2>Profile</h2>

        <div className="admin-settings-info">
          <div>
            <span>Username</span>
            <strong>
              {profile?.username ?? '-'}
            </strong>
          </div>

          <div>
            <span>Role</span>
            <strong>
              {profile?.role ?? '-'}
            </strong>
          </div>
        </div>
      </section>

      {error && (
        <p
          className="admin-settings-error"
          role="alert"
        >
          {error}
        </p>
      )}

      {successMessage && (
        <p
          className="admin-settings-success"
          role="status"
        >
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
            aria-hidden="true"
          >
            ›
          </span>
        </button>

        {isAccountOpen && (
          <div className="admin-settings-accordion-content">
            {/* form으로 감싸서 Enter로도 저장되게 함 */}
            <form
              className="admin-settings-form"
              onSubmit={handleUpdateUsername}
            >
              <label>
                <span>New Username</span>

                <input
                  type="text"
                  value={newUsername}
                  onChange={(event) => {
                    setNewUsername(event.target.value);
                    clearNotice();
                  }}
                  placeholder={profile?.username}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </label>

              <button
                type="submit"
                disabled={isSavingUsername}
              >
                {isSavingUsername
                  ? 'Saving...'
                  : 'Save Username'}
              </button>
            </form>
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
            aria-hidden="true"
          >
            ›
          </span>
        </button>

        {isPasswordOpen && (
          <div className="admin-settings-accordion-content">
            <form
              className="admin-settings-form"
              onSubmit={handleChangePassword}
            >
              <label>
                <span>Current Password</span>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    clearNotice();
                  }}
                  autoComplete="current-password"
                />
              </label>

              <label>
                <span>New Password</span>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    clearNotice();
                  }}
                  autoComplete="new-password"
                  minLength={8}
                />
              </label>

              <label>
                <span>Confirm New Password</span>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    clearNotice();
                  }}
                  autoComplete="new-password"
                />
              </label>

              <button
                type="submit"
                disabled={isChangingPassword}
              >
                {isChangingPassword
                  ? 'Changing...'
                  : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminSettings;
