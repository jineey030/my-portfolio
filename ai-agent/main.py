import os
import json
import re
import time

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm.gemini import ask_gemini
from llm.ollama import ask_ollama


# =========================================================
# Environment
# =========================================================

load_dotenv()

USE_GEMINI = os.getenv("GEMINI", "false").lower() == "true"
USE_OLLAMA = os.getenv("OLLAMA", "false").lower() == "true"

BACKEND_API_BASE_URL = os.getenv(
    "BACKEND_API_BASE_URL",
    "https://my-portfolio-backend-kgov.onrender.com"
).rstrip("/")


# =========================================================
# LLM
# =========================================================

def get_llm_provider():
    if USE_GEMINI:
        return "gemini"

    if USE_OLLAMA:
        return "ollama"

    raise RuntimeError(
        "GEMINI 또는 OLLAMA 중 하나를 true로 설정해주세요."
    )


def ask_llm(prompt: str) -> str:
    provider = get_llm_provider()

    if provider == "gemini":
        return ask_gemini(prompt)

    if provider == "ollama":
        return ask_ollama(prompt)

    raise RuntimeError("사용 가능한 LLM이 없습니다.")


# =========================================================
# Spring Boot API Client
# =========================================================

def request_backend(path: str):
    url = f"{BACKEND_API_BASE_URL}{path}"

    try:
        response = httpx.get(
            url,
            timeout=15.0,
            follow_redirects=True
        )
        response.raise_for_status()
        return response.json()

    except httpx.TimeoutException as exception:
        raise RuntimeError(
            f"백엔드 응답 시간이 초과되었습니다: {path}"
        ) from exception

    except httpx.HTTPStatusError as exception:
        raise RuntimeError(
            f"백엔드 API 오류: {path} "
            f"(HTTP {exception.response.status_code})"
        ) from exception

    except httpx.RequestError as exception:
        raise RuntimeError(
            f"백엔드에 연결할 수 없습니다: {path}"
        ) from exception

    except ValueError as exception:
        raise RuntimeError(
            f"백엔드 응답을 JSON으로 읽을 수 없습니다: {path}"
        ) from exception


def unwrap_list(data):
    """API 응답이 배열이거나 배열을 감싼 객체인 경우 처리한다."""
    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        for key in ("content", "items", "data", "results", "skills"):
            value = data.get(key)

            if isinstance(value, list):
                return value

    return []


def unwrap_object(data):
    """API 응답이 객체이거나 객체를 감싼 형태인 경우 처리한다."""
    if isinstance(data, dict):
        for key in ("data", "profile"):
            value = data.get(key)

            if isinstance(value, dict):
                return value

        return data

    if isinstance(data, list) and data:
        if isinstance(data[0], dict):
            return data[0]

    return {}


def first_value(data: dict, *keys):
    """존재하는 첫 번째 값을 반환한다."""
    for key in keys:
        value = data.get(key)

        if value is not None and value != "":
            return value

    return None


# =========================================================
# Tool 1: Profile
# =========================================================

def get_profile():
    data = request_backend("/api/portfolio-profile")
    profile = unwrap_object(data)

    if not profile:
        return {
            "error": "백엔드에서 프로필 데이터를 찾을 수 없습니다."
        }

    # 실제 API 응답 필드에 맞춰 이름을 통일한다.
    return {
        "name": first_value(
            profile, "name", "username", "userName"
        ),
        "role": first_value(
            profile, "role", "title", "position"
        ),
        "introduction": first_value(
            profile,
            "introduction",
            "description",
            "bio",
            "tagline"
        ),
        "source": "Spring Boot API"
    }


# =========================================================
# Tool 2: Skills
# =========================================================

def get_skills():
    data = request_backend("/api/portfolio-skills")
    skill_items = unwrap_list(data)

    result = {
        "frontend": [],
        "backend": [],
        "database": [],
        "other": []
    }

    for item in skill_items:
        if isinstance(item, str):
            name = item
            category = ""
        elif isinstance(item, dict):
            name = first_value(item, "name", "skillName", "title")
            category = str(
                first_value(
                    item, "category", "type", "skillType", "group"
                ) or ""
            ).lower()
        else:
            continue

        if not name:
            continue

        if any(word in category for word in (
            "frontend", "front-end", "프론트"
        )):
            group = "frontend"

        elif any(word in category for word in (
            "backend", "back-end", "백엔드", "server"
        )):
            group = "backend"

        elif any(word in category for word in (
            "database", "db", "데이터베이스"
        )):
            group = "database"

        else:
            group = "other"

        if name not in result[group]:
            result[group].append(name)

    result["source"] = "Spring Boot API"
    return result


# =========================================================
# Tool 3: Projects
# =========================================================

def get_projects():
    data = request_backend("/api/projects")
    project_items = unwrap_list(data)

    projects = []

    for item in project_items:
        if not isinstance(item, dict):
            continue

        project = {
            "id": item.get("id"),
            "name": first_value(item, "name", "title"),
            "description": first_value(
                item, "description", "introduction"
            ),
            "role": item.get("role"),
            "slug": item.get("slug"),
            "githubUrl": item.get("githubUrl"),
            "deployUrl": item.get("deployUrl"),
            "stack": []
        }

        project_id = item.get("id")

        # 프로젝트별 실제 연결 기술 스택을 조회한다.
        if project_id is not None:
            try:
                skill_data = request_backend(
                    f"/api/projects/{project_id}/skills"
                )

                skills = unwrap_list(skill_data)

                for skill in skills:
                    if isinstance(skill, str):
                        skill_name = skill
                    elif isinstance(skill, dict):
                        skill_name = first_value(
                            skill, "name", "skillName", "title"
                        )
                    else:
                        skill_name = None

                    if skill_name and skill_name not in project["stack"]:
                        project["stack"].append(skill_name)

            except RuntimeError:
                # 연결 기술 조회에 실패하면 프로젝트 응답의
                # 기술 스택 필드를 대신 사용한다.
                fallback_stack = first_value(
                    item, "stack", "techStack", "technologies"
                )

                if isinstance(fallback_stack, list):
                    project["stack"] = fallback_stack

        else:
            fallback_stack = first_value(
                item, "stack", "techStack", "technologies"
            )

            if isinstance(fallback_stack, list):
                project["stack"] = fallback_stack

        projects.append(project)

    return {
        "projects": projects,
        "source": "Spring Boot API"
    }


# =========================================================
# Tool 4: Learning
# =========================================================

def get_learning():
    # 학습 기록과 Todo는 실제 DB에 저장된 내용을 사용한다.
    study_logs = unwrap_list(
        request_backend("/api/study-logs")
    )

    todos = unwrap_list(
        request_backend("/api/todos")
    )

    current_topics = []

    for log in study_logs:
        if not isinstance(log, dict):
            continue

        topic = first_value(
            log, "topic", "subject", "title", "content", "name"
        )

        if topic and topic not in current_topics:
            current_topics.append(topic)

    return {
        "current": current_topics,
        "study_logs": study_logs,
        "todos": todos,
        "source": "Spring Boot API",
        "note": (
            "현재 학습 주제는 실제 학습 기록에서 추출했습니다. "
            "별도의 학습 목표 API는 조회하지 않았습니다."
        )
    }


# =========================================================
# Tool Registry
# =========================================================

tools = {
    "get_profile": {
        "function": get_profile,
        "description": (
            "DB에 저장된 예진님의 프로필, 역할, 자기소개를 조회합니다."
        )
    },
    "get_skills": {
        "function": get_skills,
        "description": (
            "DB에 등록된 예진님의 기술 스택을 조회합니다."
        )
    },
    "get_projects": {
        "function": get_projects,
        "description": (
            "DB에 등록된 프로젝트와 프로젝트별 기술 스택을 조회합니다."
        )
    }
}


# =========================================================
# Tool Execution
# =========================================================

def execute_tool(tool_name):
    tool = tools.get(tool_name)

    if tool is None:
        return {
            "error": f"존재하지 않는 Tool입니다: {tool_name}"
        }

    try:
        result = tool["function"]()

        print(f"[Tool] {tool_name}")
        print(json.dumps(result, ensure_ascii=False, default=str))

        return result

    except Exception as exception:
        print(f"[Tool Error] {tool_name}: {exception}")

        return {
            "error": (
                f"{tool_name} 데이터를 조회하지 못했습니다. "
                "백엔드 연결 및 API 응답을 확인해주세요."
            )
        }


# =========================================================
# LLM Tool Selection
# =========================================================

def ask_llm_to_select_tools(user_input):
    tool_descriptions = "\n".join(
        f"- {name}: {tool['description']}"
        for name, tool in tools.items()
    )

    
    prompt = f"""
너는 개발자 오예진의 포트폴리오 AI Agent에서
필요한 Tool을 선택하는 담당자야.

사용 가능한 Tool:
{tool_descriptions}

사용자 질문:
{user_input}

규칙:
- 예진님의 프로필이나 자기소개 질문은 get_profile을 선택해.
- 예진님의 기술 스택 질문은 get_skills를 선택해.
- 예진님의 프로젝트나 프로젝트별 기술 스택 질문은
  get_projects를 선택해.
- 여러 Tool이 필요하면 쉼표로 구분해.
- 위 Tool로 답할 필요가 없으면 NONE이라고 반환해.
- Tool 이름 외에 설명은 하지 마.
"""
    return ask_llm(prompt)


def parse_tool_selection(llm_result):
    result = llm_result.strip()

    # 모델이 코드 블록으로 반환한 경우도 처리한다.
    result = result.replace("```", "").strip()

    if result.upper().rstrip(".") == "NONE":
        return []

    selected_tools = []

    for name in re.split(r"[,，\n]", result):
        # 앞뒤 공백 및 일부 인용 기호 제거
        name = name.strip().strip("\"'` ")

        if name in tools and name not in selected_tools:
            selected_tools.append(name)

    return selected_tools


# =========================================================
# Question Relevance Check
# =========================================================

def is_portfolio_related(user_input: str) -> bool:
    prompt = f"""
너는 개발자 오예진의 포트폴리오 질문을 분류하는 담당자야.

사용자의 질문이 아래 주제와 직접적으로 관련 있는지 판단해.

허용되는 주제:
- 오예진의 프로필, 소개, 역할, 개발자 정보
- 오예진의 기술 스택과 개발 기술
- 오예진이 만든 프로젝트, 프로젝트 기능, 사용 기술
- 포트폴리오 웹사이트와 그 안에 공개된 정보

허용되지 않는 주제:
- 위 주제와 관계없는 일반 상식, 일상 대화, 잡담
- 다른 사람이나 다른 회사에 대한 일반적인 질문
- 코딩 문제 풀이, 일반적인 개발 지식 질문
- 공부 중인 내용, 학습 기록, Todo 및 학습 목표

단, 오예진의 프로젝트나 기술 스택을 이해하기 위해 필요한 질문은 허용해.

사용자 질문:
{user_input}

위 기준에 따라 반드시 YES 또는 NO 중 하나만 반환해.
다른 설명은 하지 마.
"""

    result = ask_llm(prompt).strip().upper()

    # 응답 앞부분에 YES 또는 NO가 있는 경우도 처리
    match = re.match(r"^(YES|NO)\b", result)

    if not match:
        return False

    return match.group(1) == "YES"

# =========================================================
# Final Answer
# =========================================================

def generate_final_answer(user_input, tool_results):
    prompt = f"""
너는 개발자 오예진의 포트폴리오를 안내하는 AI Assistant야.

사용자의 질문:
{user_input}

실제 백엔드 API에서 조회한 Tool 결과:
{json.dumps(tool_results, ensure_ascii=False, default=str)}

답변 작성 규칙:
- 예진님을 소개할 때는 "예진님"이라고 표현해.
- "내", "저", "저의" 같은 1인칭 표현을 사용하지 마.
- 조회 결과에 있는 정보만 사실로 설명해.
- 결과에 없는 기술, 프로젝트, 경험, 학습 목표를 만들어내지 마.
- 결과에 error가 있으면 해당 정보를 조회하지 못했다고 솔직하게 설명해.
- 데이터가 비어 있으면 등록된 데이터가 없다고 안내해.
- 자연스럽고 친절한 한국어 문장으로 답변해.
- 마크다운 문법을 사용하지 마.
- 제목 기호인 #, 굵게 표시하는 **, 인라인 코드 기호인 `를 사용하지 마.
- 별표나 하이픈을 이용한 목록을 만들지 마.
- 번호를 붙인 제목 대신 자연스러운 문장으로 설명해.
- 여러 항목을 설명할 때는 문단을 나누어 작성해.
- 기술 스택과 프로젝트 정보는 조회 결과에 있는 항목을 가능한 한 빠뜨리지 마.
- 사용자의 질문에 필요한 내용만 답변해.
- Tool 결과가 문자열이 아닌 객체여도 내용을 이해해서 답변해.
- 답변에는 불필요한 서론이나 결론을 붙이지 마.

위 규칙에 따라 일반 텍스트로 답변해.
"""

    answer = ask_llm(prompt)

    # 모델이 마크다운 기호를 출력한 경우 간단히 정리한다.
    answer = re.sub(r"(?m)^\s{0,3}#{1,6}\s*", "", answer)
    answer = answer.replace("**", "")
    answer = answer.replace("__", "")
    answer = answer.replace("`", "")

    # 목록 기호로 사용된 별표와 하이픈 제거
    answer = re.sub(r"(?m)^\s*[*+]\s+", "", answer)
    answer = re.sub(r"(?m)^\s*-\s+", "", answer)

    return answer.strip()


# =========================================================
# FastAPI
# =========================================================

app = FastAPI(title="YeJin Portfolio AI Agent")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://jineey-portfolio.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Request Models
# =========================================================

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    messages: list[ChatMessage] = []

# =========================================================
# Timing (단계별 소요 시간 측정)
# =========================================================

def timed(label, fn, *args):
    """함수를 실행하고 걸린 시간을 로그로 남긴다."""
    start = time.perf_counter()
    result = fn(*args)
    elapsed = time.perf_counter() - start
    print(f"[Timing] {label}: {elapsed:.2f}s", flush=True)
    return result

# =========================================================
# AI Server Health Check
# =========================================================

@app.get("/health")
def health():
    return {"status": "UP"}

# =========================================================
# Chat API
# =========================================================

@app.post("/chat")
def chat(request: ChatRequest):
    user_input = request.message.strip()

    if not user_input:
        return {
            "answer": "질문을 입력해주세요.",
            "provider": get_llm_provider()
        }

    provider = get_llm_provider()
    total_start = time.perf_counter()

    # 1. 예진님 포트폴리오와 관련 있는 질문인지 확인
    if not timed("1. relevance check", is_portfolio_related, user_input):
        return {
            "answer": "예진님과 관련된 질문을 해주세요",
            "provider": provider
        }

    # 2. 필요한 Tool 선택
    llm_result = timed("2. tool select", ask_llm_to_select_tools, user_input)

    # 3. Tool 선택 결과 파싱
    selected_tools = parse_tool_selection(llm_result)

    # 관련 질문이지만 적절한 Tool을 선택하지 못한 경우
    if not selected_tools:
        return {
            "answer": (
                "예진님과 관련된 질문을 해주세요"
            ),
            "provider": provider
        }

    # 4. 실제 Spring Boot API를 통해 Tool 실행
    results = {}

    for tool_name in selected_tools:
        results[tool_name] = timed(
            f"3. tool {tool_name}", execute_tool, tool_name
        )

    # 5. 실제 조회 결과를 바탕으로 답변 생성
    answer = timed(
        "4. final answer", generate_final_answer, user_input, results
    )

    total = time.perf_counter() - total_start
    print(
        f"[Timing] TOTAL: {total:.2f}s "
        f"(tools={selected_tools}, answer_length={len(answer)})",
        flush=True
    )

    return {
        "answer": answer,
        "provider": provider
    }
