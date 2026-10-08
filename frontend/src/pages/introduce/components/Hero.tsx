import { useEffect, useState } from 'react';
import type { PortfolioProfile } from '../../../types/portfolioProfile';
import { apiFetch } from '../../../api/api';

function Hero() {
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch(
          '/api/portfolio-profile'
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
    <section id="hero" className="hero">
      <p className="hero-greeting">$ whoami</p>

      <h1 className="hero-name">
        {profile?.name}
      </h1>

      <p className="hero-tagline">
        {profile?.tagline}
      </p>

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
