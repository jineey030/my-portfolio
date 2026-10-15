import SectionTitle from '../../../components/ui/SectionTitle';
import { usePortfolioProfile } from '../../../hooks/usePortfolioProfile';

function About() {
  const { profile, isLoading, hasError } =
    usePortfolioProfile();

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
