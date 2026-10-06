import { useEffect, useState } from 'react';
import type { PortfolioProfile } from '../../../types/portfolioProfile';
import SectionTitle from '../../../components/ui/SectionTitle';

function Contact() {
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/portfolio-profile'
        );

        if (!response.ok) {
          throw new Error('프로필을 불러오지 못했습니다.');
        }

        const data: PortfolioProfile = await response.json();

        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <section id="contact">
      <SectionTitle>Contact</SectionTitle>

      <div className="contact-links">
        {profile?.email && (
          <a
            href={`mailto:${profile.email}`}
            className="btn-outline"
          >
            Email
          </a>
        )}

        {profile?.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            GitHub
          </a>
        )}

        {profile?.velog && (
          <a
            href={profile.velog}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Velog
          </a>
        )}
      </div>
    </section>
  );
}

export default Contact;
