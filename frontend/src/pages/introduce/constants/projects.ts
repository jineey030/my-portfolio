import type { Project } from '../types/introduce'; 

export const PROJECTS: Project[] = [ 
  {
    id: 'dev-learning-tracker',
    title: 'Dev Learning Tracker',

    description:
      'React + Kotlin(Spring Boot) + MariaDB로 만든 학습 진행률 대시보드. React/Kotlin 학습 현황, Todo, 스터디 타임을 한눈에 확인할 수 있습니다.',

    stack: [
      'React',
      'TypeScript',
      'Kotlin',
      'Spring Boot',
      'MariaDB',
    ],

    features: [
      'React 학습 진행률 관리',
      'Kotlin 학습 진행률 관리',
      'Todo 등록 및 관리',
      '스터디 시간 기록',
      '학습 현황 대시보드',
    ],

    role:
      '프론트엔드 화면 설계 및 React/TypeScript 기반 UI 구현. 백엔드 API 연동 및 데이터 상태 관리.',

    challenges: [
      '학습 데이터를 한눈에 확인할 수 있도록 대시보드 UI 구성',
      'React와 Spring Boot API 간 데이터 연동',
      '학습 진행률을 직관적으로 표현하는 UI 구현',
    ],

    technicalHighlights: [
      {
        title: '프론트엔드 구조 설계',
        description:
          'React와 TypeScript를 기반으로 기능별 컴포넌트를 분리하고, 프로젝트 규모가 커져도 유지보수하기 쉬운 구조를 구성했습니다.',
      },
      {
        title: 'API 연동',
        description:
          'Spring Boot에서 제공하는 REST API와 React를 연동하여 학습 데이터와 Todo 데이터를 조회하고 관리할 수 있도록 구성했습니다.',
      },
      {
        title: '데이터 기반 UI',
        description:
          '학습 진행률과 스터디 시간을 데이터 기반으로 표현하여 사용자가 현재 학습 상태를 직관적으로 확인할 수 있도록 구성했습니다.',
      },
    ],

    github: 'https://github.com/example/dev-learning-tracker',
    demo: 'https://example.com',
  }
];
