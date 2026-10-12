# // my-portfolio

> 프론트엔드와 백엔드를 직접 연결해보며 기술을 학습하기 위해 만든 개인 포트폴리오 프로젝트입니다.
> React로 만든 소개 페이지와, Kotlin/Spring Boot로 만든 API 서버를 함께 다루면서
> 풀스택 흐름(요청 → 처리 → 응답 → 렌더링)을 직접 몸으로 익히는 것을 목표로 합니다.
> 최근에는 Python + FastAPI 기반의 AI Agent를 추가하여
> Tool Calling, Tool Registry, Agent Loop 등의 개념을 직접 구현하고 있습니다.

<p>
  <img src="https://img.shields.io/badge/React-19-5eead4?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-c084fc?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Kotlin-2.3-4ade80?logo=kotlin&logoColor=black" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-f472b6?logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MariaDB-JPA-1a2029?logo=mariadb&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white" />
</p>

---

## // about

개발 공부를 하면서 만든 개인 소개 & 학습 기록용 웹사이트입니다.
프론트엔드는 React 기반 SPA로 자기소개 페이지를 구성했고,
백엔드는 Spring Boot + JPA + MariaDB로 API 서버를 구축하는 연습을 하고 있습니다.

Python + FastAPI 기반의 AI Agent를 추가하여
포트폴리오에 대한 질문에 답변할 수 있는 AI Chat UI를 구현하고 있습니다.

- 새로운 기술 스택(React 19, Kotlin, Spring Boot 4)을 직접 써보고 익히기 위한 학습용 프로젝트입니다.
- 프론트/백엔드를 분리된 서버로 두고 CORS 설정, 환경변수 관리 등 실제 서비스에 가까운 구조로 연습합니다.
- AI Agent를 직접 구현하면서 Tool Calling과 Agent Loop의 동작 원리를 학습합니다.
- 기능과 구조는 계속 추가/변경될 예정입니다. (진행 중인 프로젝트)

---

## // tech stack

| 영역 | 스택 |
| --- | --- |
| **Frontend** |	React 19, TypeScript, Vite, React Router |
| **Backend** | 	Kotlin, Spring Boot 4, Spring Data JPA  |
| **AI Agent**	| Python 3.13, FastAPI, Tool Calling, Tool Registry, Agent Loop |
| **LLM** | Google Gemini, Ollama |
| **Database** |	MariaDB / MySQL |
| **Deployment** | Vercel, Render  |
| **Tooling** | Gradle (Kotlin DSL), npm, uvicorn, Git  |

## // architecture

현재 프로젝트는 프론트엔드, 일반 API 서버, AI Agent 서버를 분리하여 구성하고 있습니다.

```text
                         ┌─────────────────────┐
                         │      Browser        │
                         │  React + TypeScript │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   │                                 │
                   ▼                                 ▼
        ┌─────────────────────┐          ┌─────────────────────┐
        │   Spring Boot API   │          │   FastAPI AI Agent  │
        │       Render        │          │       Render        │
        └──────────┬──────────┘          └──────────┬──────────┘
                   │                                │
                   ▼                                ▼
        ┌─────────────────────┐          ┌─────────────────────┐
        │    MySQL / MariaDB  │          │       Gemini        │
        │      Database       │          │        LLM          │
        └─────────────────────┘          └─────────────────────┘
                                                    │
                                                    │ Development
                                                    ▼
                                           ┌─────────────────────┐
                                           │       Ollama        │
                                           │      qwen3:4b       │
                                           └─────────────────────┘
```

## // project structure

```text
my-portfolio/
├── ai-agent/
│   ├── llm/
│   │   ├── gemini.py
│   │   └── ollama.py
│   ├── .gitignore
│   ├── main.py
│   └── requirements.txt
│
├── svgfrontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── ...
│   ├── public/
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── kotlin/
│   │           └── com/devlog/backend/
│   │               ├── todo/
│   │               ├── project/
│   │               ├── skill/
│   │               └── ...
│   ├── build.gradle.kts
│   └── ...
│
└── README.md
```

---


## // getting started
본 프로젝트는 **Frontend (React + Vite), Backend (Spring Boot), AI Agent (FastAPI), MariaDB**로 구성됩니다.

### Prerequisites

실행 전 다음 항목이 설치되어 있어야 합니다.

- Git
- Node.js 및 npm
- JDK (프로젝트의 Gradle 설정에 명시된 버전)
- MariaDB
- Python 및 pip

### 1. Clone Repository

```bash
git clone <GIT_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

저장소를 clone한 후 아래 순서에 따라 각 서비스를 설정하고 실행합니다.

### 2. Frontend 실행

프론트엔드 디렉터리로 이동하여 의존성을 설치합니다.

```bash
cd frontend
npm install
```

`frontend/.env` 파일을 생성하고 백엔드 API 주소를 설정합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

개발 서버를 실행합니다.

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API Base URL: `http://localhost:8080`

> **참고**
>
> - `.env` 파일은 `frontend/package.json`과 `vite.config.js`가 있는 프로젝트 루트에 생성합니다.
> - 환경변수를 변경한 경우 Vite 개발 서버를 재시작해야 합니다.
> - `.env` 파일은 GitHub에 업로드하지 않습니다.

### 3. Backend 실행

#### 3.1. MariaDB 설정

MariaDB 서버를 실행하고 `devlog` 데이터베이스를 미리 생성합니다.

```sql
CREATE DATABASE devlog
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

DB 계정에 해당 데이터베이스에 대한 접근 권한이 부여되어 있어야 합니다.

#### 3.2. 환경변수 설정

백엔드는 DB 접속 정보를 환경변수 `DB_USERNAME`, `DB_PASSWORD`로 관리합니다.

**Windows PowerShell**

```powershell
$env:DB_USERNAME="your_db_username"
$env:DB_PASSWORD="your_db_password"
```

**Linux / macOS**

```bash
export DB_USERNAME=your_db_username
export DB_PASSWORD=your_db_password
```

실제 DB 계정 정보로 값을 변경합니다.

#### 3.3. Backend 실행 (`local` 프로필)

백엔드 디렉터리로 이동합니다.

```powershell
cd backend
```

**Windows PowerShell**

```powershell
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```

**Linux / macOS**

```bash
./gradlew bootRun --args="--spring.profiles.active=local"
```

- Backend: http://localhost:8080
- Spring Profile: `local`

> **설정 안내**
>
> - `application.properties`에서 `${DB_USERNAME}`, `${DB_PASSWORD}` 환경변수를 참조합니다.
> - `application-local.properties`가 존재하면 `local` 프로필 활성화 시 해당 설정도 함께 적용됩니다.
> - DB 접속 URL, 포트 및 기타 필수 설정은 프로젝트의 설정 파일을 확인합니다.
> - 환경변수는 백엔드를 실행하는 터미널에 설정해야 합니다.

### 4. AI Agent 실행

Python 가상환경을 생성하고 AI Agent의 의존성을 설치합니다.

#### 4.1. 가상환경 생성 (최초 1회)

**Windows PowerShell**

```powershell
cd ai-agent
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

가상환경 활성화 후 의존성을 설치합니다.

```powershell
pip install -r requirements.txt
```

> `requirements.txt`가 저장소에 포함되어 있어야 합니다.

#### 4.2. AI Agent 실행

가상환경을 활성화한 상태에서 실행합니다.

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- AI Agent: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

> `main.py`에 FastAPI 인스턴스 `app`이 정의되어 있어야 위 명령어를 사용할 수 있습니다.

### 5. 전체 실행 순서

각 서비스는 별도의 터미널에서 실행합니다.

| 순서 | 서비스 | 실행 방법 |
|---|---|---|
| 1 | MariaDB | MariaDB 서버 실행 |
| 2 | AI Agent | `uvicorn main:app --reload --host 127.0.0.1 --port 8000` |
| 3 | Backend | `.\gradlew.bat bootRun --args="--spring.profiles.active=local"` |
| 4 | Frontend | `npm run dev` |

### 6. 주요 접속 주소

| 서비스 | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| AI Agent | http://localhost:8000 |
| AI Agent Swagger UI | http://localhost:8000/docs |

### 7. Troubleshooting

#### Frontend API 요청 실패

1. `frontend/.env`에 `VITE_API_BASE_URL=http://localhost:8080`이 설정되어 있는지 확인합니다.
2. Vite 개발 서버를 재시작합니다.
3. 브라우저 개발자 도구의 Network 탭에서 Request URL과 HTTP 상태 코드를 확인합니다.

#### Backend DB 연결 실패

1. MariaDB 서버가 실행 중인지 확인합니다.
2. `devlog` 데이터베이스가 생성되어 있는지 확인합니다.
3. `DB_USERNAME`, `DB_PASSWORD` 환경변수가 올바르게 설정되어 있는지 확인합니다.
4. `application.properties` 및 `application-local.properties`의 DB 연결 설정을 확인합니다.

#### AI Agent 요청 실패

1. AI Agent가 `localhost:8000`에서 실행 중인지 확인합니다.
2. http://localhost:8000/docs 에 접속하여 API 엔드포인트를 확인합니다.
3. Backend의 AI Agent 연결 주소 및 관련 설정을 확인합니다.

### 8. 환경변수 및 보안

- DB 계정 정보와 API 키를 소스 코드에 직접 작성하지 않습니다.
- 실제 비밀번호나 민감한 정보가 포함된 `.env` 및 로컬 설정 파일은 Git에 커밋하지 않습니다.
- `.env.example` 등의 예시 파일에는 실제 비밀번호 대신 placeholder를 사용합니다.
- `VITE_` 접두사가 붙은 환경변수는 프론트엔드 번들에 노출될 수 있으므로 비밀 정보를 저장하지 않습니다.`

---

## // LLM Provider

현재 두 가지 Provider를 사용할 수 있습니다.

```text
Gemini
  ↑
  │ Production
  │
FastAPI
  │
  │ Development
  ↓
Ollama
```

Production에서는 Gemini를 사용하고,
로컬 개발 환경에서는 Ollama를 사용할 수 있도록 환경변수로 전환할 수 있습니다.

```env
GEMINI=true
OLLAMA=false
```

또는

```env
GEMINI=false
OLLAMA=true
```

---

## // deploy
| 서비스	| 배포 | 환경 | 주소 |
| --- | --- | --- | --- |
| Portfolio | Frontend	| Vercel | https://jineey-portfolio.vercel.app|
| Spring Boot | Backend	| Render	| - |
| AI Agent | API	| Render	| - |
| MySQL | Database | aiven | - |

---

## // learning goals 🏆

이 프로젝트를 통해 다음과 같은 내용을 직접 구현하며 학습하고 있습니다.

### Frontend

* React 컴포넌트 설계
* 상태 관리
* React Router
* API 통신
* 환경변수 관리
* CRUD UI 구현

### Backend

* Kotlin
* Spring Boot
* REST API
* Controller / Service / Repository
* Spring Data JPA
* Database 연동
* CORS
* 환경변수 관리

### AI Agent

* FastAPI
* Tool Calling
* Tool Registry
* Agent Loop
* LLM Provider 분리
* Gemini API
* Ollama
* AI Chat UI
* Frontend ↔ AI API 연결

### Deployment

* GitHub
* Vercel
* Render
* Production 환경변수
* CORS
* 서버 간 API 통신

## // contact

- GitHub: [@jineey030](https://github.com/jineey030)

---

<sub>학습 목적으로 자유롭게 구조와 기술 스택을 변경하며 실험 중인 프로젝트입니다. 🌱</sub>
