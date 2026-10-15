import { useEffect, useState } from 'react';
import type { PortfolioProfile } from '../../../types/portfolioProfile';
import SectionTitle from '../../../components/ui/SectionTitle';
import { apiFetch } from '../../../api/api';

function About() {
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

  // 실패 / 내용 없음일 때는 빈 섹션 대신 안내 문구를 보여준다
  const aboutText = hasError
    ? '소개를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'
    : profile?.aboutText?.trim() || '소개가 아직 등록되지 않았습니다.';

  return (
    <section id="about" aria-busy={isLoading}>
      <SectionTitle>About</SectionTitle>

      {isLoading ? (
        // 로딩 중에는 실제 문단 모양의 스켈레톤을 보여준다
        <div
          className="skeleton about-skeleton"
          role="status"
          aria-label="소개를 불러오는 중"
        >
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line" />
        </div>
      ) : (
        <p className="about-text">
          {aboutText}
        </p>
      )}
    </section>
  );
}

export default About;
