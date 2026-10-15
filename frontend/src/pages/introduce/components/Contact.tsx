import SectionTitle from '../../../components/ui/SectionTitle';
import { usePortfolioProfile } from '../../../hooks/usePortfolioProfile';

function Contact() {
  const { profile, isLoading, hasError } =
    usePortfolioProfile();

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
