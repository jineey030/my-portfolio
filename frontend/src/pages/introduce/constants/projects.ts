import type { Project } from '../types/introduce'; 

export const PROJECTS: Project[] = [ 
  { 
    id: 'dev-learning-tracker', 
    title: 'Dev Learning Tracker', description: 'React + Kotlin(Spring Boot) + MariaDB로 만든 학습 진행률 대시보드. React/Kotlin 학습 현황, Todo, 스터디 타임을 한눈에 확인할 수 있습니다.', 
    stack: [ 'React', 'TypeScript', 'Kotlin', 'Spring Boot', 'MariaDB', ], 
    features: [ 'React 학습 진행률 관리', 'Kotlin 학습 진행률 관리', 'Todo 등록 및 관리', '스터디 시간 기록', '학습 현황 대시보드', ], 
    role: '프론트엔드 화면 설계 및 React/TypeScript 기반 UI 구현. 백엔드 API 연동 및 데이터 상태 관리.', 
    challenges: [ '학습 데이터를 한눈에 확인할 수 있도록 대시보드 UI 구성', 'React와 Spring Boot API 간 데이터 연동', '학습 진행률을 직관적으로 표현하는 UI 구현', ], 
    github: 'https://github.com/example/dev-learning-tracker', demo: 'https://example.com',
  }, 
  { 
    id: 'portfolio', title: 'Personal Portfolio', description: 'React와 TypeScript를 활용해 제작한 개인 포트폴리오 웹사이트입니다. 프로젝트와 기술 스택을 정리하고 개발 경험을 소개합니다.', 
    stack: [ 'React', 'TypeScript', 'React Router', 'CSS', ], 
    features: [ '자기소개 페이지', '프로젝트 목록', '프로젝트 상세 페이지', '기술 스택 소개', '반응형 웹 디자인', ],
    role: '프로젝트 기획부터 UI 구현, 라우팅 및 컴포넌트 구조 설계까지 전체 개발을 담당했습니다.', 
    challenges: [ '재사용 가능한 컴포넌트 구조 설계', '프로젝트 데이터를 기반으로 상세 페이지를 동적으로 구성', '페이지 간 라우팅 구조 설계', ], 
    github: 'https://github.com/example/portfolio', demo: 'https://example.com', 
  }, 
  { 
    id: 'todo-app', title: 'Todo Management App', description: '할 일을 등록하고 관리할 수 있는 간단한 Todo 애플리케이션입니다. React의 상태 관리와 컴포넌트 설계를 연습하기 위해 제작했습니다.', 
    stack: [ 'React', 'TypeScript', 'CSS', ], features: [ 'Todo 추가', 'Todo 완료 처리', 'Todo 삭제', '완료 여부 필터링', ], 
    role: 'React 컴포넌트 설계와 상태 관리, 사용자 인터랙션 및 UI 구현을 담당했습니다.', challenges: [ 'Todo 상태를 효율적으로 관리하기', '컴포넌트 간 데이터 전달 구조 설계', '사용자 인터랙션에 따른 UI 업데이트 처리', ], 
    github: 'https://github.com/example/todo-app', demo: 'https://example.com', 
  },
];
