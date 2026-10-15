import { usePortfolioProfile } from '../../../hooks/usePortfolioProfile';

// 프로필을 불러오지 못했을 때 보여줄 기본 이름
const FALLBACK_NAME = 'YeJin';

function Hero() {
  const { profile, isLoading, hasError } =
    usePortfolioProfile();

  const name = profile?.name?.trim() || FALLBACK_NAME;

  const tagline = hasError
    ? '프로필을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'
    : profile?.tagline?.trim() || '';

  return (
    <section
      id="hero"
      className="hero"
      aria-busy={isLoading}
    >
      <p className="hero-greeting">$ whoami</p>

      {isLoading ? (
        // 이름 1줄 + 소개 2줄 모양의 스켈레톤
        <div
          className="skeleton hero-skeleton"
          role="status"
          aria-label="프로필을 불러오는 중"
        >
          <span className="skeleton-line hero-skeleton-name" />
          <span className="skeleton-line hero-skeleton-tagline" />
          <span className="skeleton-line hero-skeleton-tagline" />
        </div>
      ) : (
        <>
          <h1 className="hero-name">
            {name}
          </h1>

          {tagline && (
            <p className="hero-tagline">
              {tagline}
            </p>
          )}
        </>
      )}

      {/* 버튼은 데이터와 상관없이 항상 보여준다 */}
      <div className="hero-cta">
        <a
          href="#projects"
          className="btn-primary"
        >
          프로젝트 보기
        </a>

        <a
          href="#contact"
          className="btn-outline"
        >
          연락하기
        </a>
      </div>
    </section>
  );
}

export default Hero;
