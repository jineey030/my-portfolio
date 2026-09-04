# // my-portfolio

> 프론트엔드와 백엔드를 직접 연결해보며 기술을 학습하기 위해 만든 개인 포트폴리오 프로젝트입니다.
> React로 만든 소개 페이지와, Kotlin/Spring Boot로 만든 API 서버를 함께 다루면서
> 풀스택 흐름(요청 → 처리 → 응답 → 렌더링)을 직접 몸으로 익히는 것을 목표로 합니다.

<p>
  <img src="https://img.shields.io/badge/React-19-5eead4?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-c084fc?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Kotlin-2.3-4ade80?logo=kotlin&logoColor=black" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-f472b6?logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MariaDB-JPA-1a2029?logo=mariadb&logoColor=white" />
</p>

---

## // about

개발 공부를 하면서 만든 개인 소개 & 학습 기록용 웹사이트입니다.
프론트엔드는 React 기반 SPA로 자기소개(Hero / About / Projects / Skills / Contact) 페이지를 구성했고,
백엔드는 Spring Boot + JPA + MariaDB로 API 서버를 구축하는 연습을 하고 있습니다.

- 새로운 기술 스택(React 19, Kotlin, Spring Boot 4)을 직접 써보고 익히기 위한 학습용 프로젝트입니다.
- 프론트/백엔드를 분리된 서버로 두고 CORS 설정, 환경변수 관리 등 실제 서비스에 가까운 구조로 연습합니다.
- 기능과 구조는 계속 추가/변경될 예정입니다. (진행 중인 프로젝트)

## // tech stack

| 영역 | 스택 |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, React Router |
| **Backend** | Kotlin, Spring Boot 4 (Web MVC), Spring Data JPA |
| **Database** | MariaDB |
| **Tooling** | Gradle (Kotlin DSL), oxlint |

## // getting started

### 1. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

기본적으로 `http://localhost:5173` 에서 실행됩니다.

### 2. Backend 실행

MariaDB에 `devlog` 데이터베이스가 미리 생성되어 있어야 합니다.

```bash
cd backend

# 환경변수 설정 (DB 계정 정보)
export DB_USERNAME=your_db_username
export DB_PASSWORD=your_db_password

./gradlew bootRun
```

기본적으로 `http://localhost:8080` 에서 실행되며, `/api/**` 요청에 대해
`http://localhost:5173`(프론트엔드)로부터의 CORS 요청을 허용하도록 설정되어 있습니다.

> `application.properties`는 `${DB_USERNAME}`, `${DB_PASSWORD}` 환경변수를 참조합니다.
> `.env` 파일 대신 실행 전 셸에서 직접 export 하거나, IDE의 Run Configuration에 등록해서 사용하세요.

## // contact

- GitHub: [@jineey030](https://github.com/jineey030)

---

<sub>학습 목적으로 자유롭게 구조와 기술 스택을 변경하며 실험 중인 프로젝트입니다. 🌱</sub>
