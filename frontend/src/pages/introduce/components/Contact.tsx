import { useEffect, useState } from 'react';
import type { PortfolioProfile } from '../../../types/portfolioProfile';
import SectionTitle from '../../../components/ui/SectionTitle';
import { apiFetch } from '../../../api/api';

function Contact() {
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 화면을 빨리 벗어나도 끝난 요청이 상태를 바꾸지 않도록
    let active = true;

    const fetchProfile = async () => {
      try {
        const response = await apiFetch(
          '/api/portfolio-profile'
        );

        if (!response.ok) {
          throw new Error('프로필을 불러오지 못했습니다.');
        }

        const data: PortfolioProfile = await response.json();

        if (active) {
          setProfile(data);
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  const email = profile?.email?.trim();
  const github = profile?.github?.trim();
  const velog = profile?.velog?.trim();

  const hasAnyLink = Boolean(email || github || velog);

  const renderContent = () => {
    // 로딩 중: 버튼 모양의 스켈레톤
    if (isLoading) {
      return (
        <div
          className="contact-links"
          role="status"
          aria-label="연락처를 불러오는 중"
        >
          <span className="skeleton-line contact-skeleton-button" />
          <span className="skeleton-line contact-skeleton-button" />
          <span className="skeleton-line contact-skeleton-button" />
        </div>
      );
    }

    if (hasError) {
      return (
        <p className="contact-message">
          연락처를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.
        </p>
      );
    }

    if (!hasAnyLink) {
      return (
        <p className="contact-message">
          연락처가 아직 등록되지 않았습니다.
        </p>
      );
    }

    return (
      <div className="contact-links">
        {email && (
          <a
            href={`mailto:${email}`}
            className="btn-outline"
          >
            Email
          </a>
        )}

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            GitHub
          </a>
        )}

        {velog && (
          <a
            href={velog}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Velog
          </a>
        )}
      </div>
    );
  };

  return (
    <section id="contact" aria-busy={isLoading}>
      <SectionTitle>Contact</SectionTitle>

      {renderContent()}
    </section>
  );
}

export default Contact;
