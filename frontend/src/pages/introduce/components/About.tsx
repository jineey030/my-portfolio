import { useEffect, useState } from 'react';
import type { PortfolioProfile } from '../../../types/portfolioProfile';
import SectionTitle from '../../../components/ui/SectionTitle';

function About() {
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
    <section id="about">
      <SectionTitle>About</SectionTitle>

      <p className="about-text">
        {profile?.aboutText}
      </p>
    </section>
  );
}

export default About;
