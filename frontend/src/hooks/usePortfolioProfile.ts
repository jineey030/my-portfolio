import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import type { PortfolioProfile } from '../types/portfolioProfile';

/*
  Hero / About / Contact가 같은 프로필을 각자 요청하면
  페이지를 열 때마다 같은 API가 3번 호출된다.

  진행 중인 요청을 하나만 만들고, 동시에 마운트된 컴포넌트들이 그 요청을 같이 기다린다.
  요청이 끝나면 비워두므로, 다음에 페이지에 들어올 때는 항상 최신 데이터를 받는다.
  (관리자 화면에서 프로필을 수정한 뒤에도 바로 반영됨)
*/
let inFlight: Promise<PortfolioProfile> | null = null;

function loadPortfolioProfile() {
  if (!inFlight) {
    inFlight = apiFetch('/api/portfolio-profile')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('프로필을 불러오지 못했습니다.');
        }

        return (await response.json()) as PortfolioProfile;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
}

export function usePortfolioProfile() {
  const [profile, setProfile] =
    useState<PortfolioProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 화면을 빨리 벗어나도 끝난 요청이 상태를 바꾸지 않도록
    let active = true;

    loadPortfolioProfile()
      .then((data) => {
        if (active) {
          setProfile(data);
        }
      })
      .catch((error) => {
        console.error(error);

        if (active) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { profile, isLoading, hasError };
}
