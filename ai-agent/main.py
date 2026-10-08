import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from llm.gemini import ask_gemini
from llm.ollama import ask_ollama


# =========================================================
# Environment
# =========================================================

load_dotenv()

USE_GEMINI = os.getenv("GEMINI", "false").lower() == "true"
USE_OLLAMA = os.getenv("OLLAMA", "false").lower() == "true"


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
        return ask_gemini(prompt, {})

    if provider == "ollama":
        return ask_ollama(prompt)

# =========================================================
# Tool
# =========================================================

def get_profile():

    return {
        "name": "오예진",
        "role": "개발자",
        "introduction": "배우고, 만들면서 성장하는 개발자입니다"
    }


def get_skills():

    return {
        "frontend": [
            "React",
            "TypeScript"
        ],
        "backend": [
            "Kotlin",
            "Spring Boot",
            "Node.js"
        ],
        "database": [
            "MariaDB",
            "PostgreSQL"
        ]
    }


def get_projects():

    return [
        {
            "name": "Dev Learning Tracker",
            "description": "React와 Kotlin으로 학습 현황과 Todo를 관리하는 서비스",
            "stack": [
                "React",
                "Kotlin",
                "Spring Boot",
                "MariaDB"
            ]
        }
    ]


def get_learning():

    return {
        "current": [
            "React",
            "Kotlin",
            "Spring Boot",
            "AI Agent",
            "MCP"
        ],
        "goal": "배운 내용을 직접 동작하는 서비스로 만드는 것"
    }


# =========================================================
# Tool Registry
# =========================================================

tools = {

    "get_profile": {
        "function": get_profile,
        "description": "예진의 기본 프로필 정보를 가져옵니다."
    },

    "get_skills": {
        "function": get_skills,
        "description": "예진이 사용하는 기술 스택 정보를 가져옵니다."
    },

    "get_projects": {
        "function": get_projects,
        "description": "예진이 만든 프로젝트 정보를 가져옵니다."
    },

    "get_learning": {
        "function": get_learning,
        "description": "예진이 현재 공부하고 있는 내용을 가져옵니다."
    }
}


# =========================================================
# Tool 실행
# =========================================================

def execute_tool(tool_name):

    tool = tools.get(tool_name)

    if tool is None:

        return {
            "error": f"존재하지 않는 Tool입니다: {tool_name}"
        }

    return tool["function"]()


# =========================================================
# LLM Tool 선택
# =========================================================

def ask_llm_to_select_tools(user_input):

    tool_descriptions = []

    for tool_name, tool in tools.items():

        tool_descriptions.append(
            f"- {tool_name}: {tool['description']}"
        )

    prompt = f"""
너는 AI Agent의 Tool 선택 담당자야.

사용자의 질문을 보고 필요한 Tool을 선택해.

사용 가능한 Tool:

{chr(10).join(tool_descriptions)}

사용자 질문:
{user_input}

규칙:
- 필요한 Tool의 이름만 반환해.
- 여러 Tool이 필요하면 쉼표로 구분해.
- Tool이 필요하지 않으면 NONE이라고 반환해.
- 설명하지 말고 결과만 반환해.
"""

    return ask_llm(prompt)


# =========================================================
# Tool 선택 결과 파싱
# =========================================================

def parse_tool_selection(llm_result):

    result = llm_result.strip()

    if result == "NONE":
        return []

    selected_tools = []

    for tool_name in result.split(","):

        tool_name = tool_name.strip()

        if tool_name in tools:
            selected_tools.append(tool_name)

    return selected_tools


# =========================================================
# 최종 답변 생성
# =========================================================

def generate_final_answer(
    user_input,
    tool_results
):

    prompt = f"""
너는 개발자 오예진의 포트폴리오를 소개하는 AI Assistant야.

사용자가 포트폴리오에 대해 질문하면
오예진을 소개하는 것처럼 자연스럽고 친절하게 답변해.

사용자의 질문:
{user_input}

Tool 실행 결과:
{tool_results}

답변 규칙:
- 오예진에 대해 이야기할 때는 "예진님"이라고 표현해.
- "내", "저", "저의" 같은 1인칭 표현을 사용하지 마.
- Tool 결과에 있는 정보만 사용해.
- Tool 결과에 없는 정보는 만들어내지 마.
- 단순히 데이터를 나열하지 말고 자연스러운 문장으로 설명해.
- 질문에 필요한 정보만 답변해.
- 사용자가 "프로필 정보", "프로필"을 물어보면 이름, 역할, 소개를 자연스럽게 설명해.
- 너무 딱딱한 문체보다는 포트폴리오를 안내하는 친절한 말투를 사용해.

예시:
사용자: "내 프로필 정보 알려줘"
답변: "예진님의 프로필을 소개해드릴게요. 예진님은 개발자로, 배우고 만든 것을 직접 동작하는 서비스로 만들어가며 성장하고 있습니다."

사용자: "기술 스택 알려줘"
답변: "예진님은 프론트엔드에서 React와 TypeScript를 사용하고 있으며, 백엔드에서는 Kotlin과 Spring Boot, Node.js를 사용하고 있습니다."

이제 사용자의 질문에 답변해.
"""

    return ask_llm(prompt)


# =========================================================
# FastAPI
# =========================================================

app = FastAPI()


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
# Request Model
# =========================================================

class ChatMessage(BaseModel):

    role: str
    content: str


class ChatRequest(BaseModel):

    message: str
    messages: list[ChatMessage]


# =========================================================
# Chat API
# =========================================================

@app.post("/chat")
def chat(request: ChatRequest):

    user_input = request.message

    # =====================================================
    # 1. LLM에게 Tool 선택 요청
    # =====================================================

    llm_result = ask_llm_to_select_tools(
        user_input
    )

    # =====================================================
    # 2. LLM 결과를 Tool 이름으로 변환
    # =====================================================

    selected_tools = parse_tool_selection(
        llm_result
    )

    # =====================================================
    # 3. 사용할 Tool이 없는 경우
    # =====================================================

    if not selected_tools:

        return {
            "answer": (
                "질문에 답변하기 위해 사용할 수 있는 "
                "Tool을 찾지 못했습니다."
            )
        }

    # =====================================================
    # 4. Tool 실행
    # =====================================================

    results = {}

    for tool_name in selected_tools:

        results[tool_name] = execute_tool(
            tool_name
        )

    # =====================================================
    # 5. Tool 결과를 LLM에게 전달
    # =====================================================

    answer = generate_final_answer(
        user_input,
        results
    )

    return {
        "answer": answer,
        "provider": get_llm_provider()
    }
