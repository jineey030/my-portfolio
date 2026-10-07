import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import type { PortfolioProfile as PortfolioProfileType } from '../../../types/portfolioProfile';

function PortfolioProfile() {
  const [profile, setProfile] =
    useState<PortfolioProfileType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await apiFetch(
          '/api/portfolio-profile'
        );

        if (!response.ok) {
          throw new Error('프로필을 불러오지 못했습니다.');
        }

        const data: PortfolioProfileType =
          await response.json();

        setProfile(data);
      } catch (error) {
        console.error(error);
        setError('프로필을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    field: keyof PortfolioProfileType,
    value: string
  ) => {
    if (!profile) {
      return;
    }

    setProfile({
      ...profile,
      [field]: value
    });

    setMessage('');
    setError('');
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage('');
      setError('');

      const response = await apiFetch(
        '/api/portfolio-profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: profile.name,
            tagline: profile.tagline,
            email: profile.email,
            github: profile.github,
            velog: profile.velog,
            aboutText: profile.aboutText
          })
        }
      );

      if (!response.ok) {
        throw new Error('프로필 저장에 실패했습니다.');
      }

      const updatedProfile: PortfolioProfileType =
        await response.json();

      setProfile(updatedProfile);
      setMessage('프로필이 저장되었습니다.');
    } catch (error) {
      console.error(error);
      setError('프로필 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="admin-page">
        <p>프로필을 불러오는 중...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="admin-page">
        <p>{error || '프로필을 불러올 수 없습니다.'}</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="admin-page-label">
          ADMIN / PORTFOLIO / PROFILE
        </p>

        <h1>Portfolio Profile</h1>

        <p className="admin-page-description">
          포트폴리오에 표시되는 프로필 정보를 관리합니다.
        </p>
      </header>

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
            value={profile.name}
            onChange={(event) =>
              handleChange(
                'name',
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="tagline">
            Tagline
          </label>

          <input
            id="tagline"
            type="text"
            value={profile.tagline}
            onChange={(event) =>
              handleChange(
                'tagline',
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={profile.email}
            onChange={(event) =>
              handleChange(
                'email',
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="github">
            GitHub
          </label>

          <input
            id="github"
            type="url"
            value={profile.github}
            onChange={(event) =>
              handleChange(
                'github',
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="velog">
            Velog
          </label>

          <input
            id="velog"
            type="url"
            value={profile.velog}
            onChange={(event) =>
              handleChange(
                'velog',
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="aboutText">
            About
          </label>

          <textarea
            id="aboutText"
            rows={8}
            value={profile.aboutText}
            onChange={(event) =>
              handleChange(
                'aboutText',
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-form-actions">
          <button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

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
      </form>
    </main>
  );
}

export default PortfolioProfile;