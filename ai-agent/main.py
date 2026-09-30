from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm.gemini import gemini_answer

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
        "description": "예진의 기본 프로필 정보를 가져옵니다.",
        "keywords": [
            "개발자",
            "소개",
            "누구",
            "어떤 사람",
            "프로필"
        ]
    },

    "get_skills": {
        "function": get_skills,
        "description": "예진이 사용하는 기술 스택 정보를 가져옵니다.",
        "keywords": [
            "기술",
            "스택",
            "기술 스택",
            "사용하는 기술",
            "무슨 기술",
            "frontend",
            "backend"
        ]
    },

    "get_projects": {
        "function": get_projects,
        "description": "예진이 만든 프로젝트 정보를 가져옵니다.",
        "keywords": [
            "프로젝트",
            "만든 것",
            "무엇을 만들었",
            "작업"
        ]
    },

    "get_learning": {
        "function": get_learning,
        "description": "예진이 현재 공부하고 있는 내용을 가져옵니다.",
        "keywords": [
            "공부",
            "학습",
            "배우",
            "요즘 뭐",
            "관심사",
            "최근 관심"
        ]
    }
}


# =========================================================
# Portfolio 질문인지 확인
# =========================================================

PORTFOLIO_KEYWORDS = [
    "예진",
    "내",
    "너",
    "프로필",
    "개발자",
    "프로젝트",
    "기술 스택",
    "기술",
    "공부",
    "학습",
]


def is_portfolio_question(user_input):

    user_input = user_input.lower()

    return any(
        keyword.lower() in user_input
        for keyword in PORTFOLIO_KEYWORDS
    )


# =========================================================
# Tool 선택
# =========================================================

def select_tools(user_input):

    user_input = user_input.lower()

    requested_tools = []

    for tool_name, tool in tools.items():

        for keyword in tool["keywords"]:

            if keyword.lower() in user_input:

                requested_tools.append(tool_name)

                break

    return requested_tools


# =========================================================
# Fake AI
# =========================================================

def fake_ai(user_input):

    # -----------------------------------------------------
    # 1. 포트폴리오 관련 질문인지 확인
    # -----------------------------------------------------

    if not is_portfolio_question(user_input):

        return {
            "type": "out_of_scope",
            "content": (
                "예진님에 관련된 정보만 질문해주세요. 😊\n\n"
                "예를 들면 이런 질문을 할 수 있어요.\n"
                "- 어떤 기술을 사용하나요?\n"
                "- 어떤 프로젝트를 만들었나요?\n"
                "- 요즘 무엇을 공부하고 있나요?\n"
                "- 어떤 개발자인가요?"
            )
        }

    # -----------------------------------------------------
    # 2. 필요한 Tool 선택
    # -----------------------------------------------------

    requested_tools = select_tools(
        user_input
    )

    # 포트폴리오 관련 질문이지만
    # 현재 등록된 Tool로 답변할 수 없는 경우
    if not requested_tools:

        return {
            "type": "unknown",
            "content": (
                "예진님의 포트폴리오와 관련된 질문이지만 "
                "현재 등록된 정보로는 답변하기 어려워요."
            )
        }

    return {
        "type": "tool_request",
        "tools": requested_tools
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
# FastAPI
# =========================================================

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
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
    # 1. Fake AI
    # =====================================================

    decision = fake_ai(
        user_input
    )

    # =====================================================
    # 2. 포트폴리오와 관계없는 질문
    # =====================================================

    if decision["type"] == "out_of_scope":

        return {
            "answer": decision["content"]
        }

    # =====================================================
    # 3. 등록된 Tool로 답변할 수 없는 질문
    # =====================================================

    if decision["type"] == "unknown":

        return {
            "answer": decision["content"]
        }

    # =====================================================
    # 4. Tool 실행
    # =====================================================

    results = {}

    for tool_name in decision["tools"]:

        results[tool_name] = execute_tool(
            tool_name
        )

    # =====================================================
    # 5. LLM에게 자연어 답변 요청
    # =====================================================

    answer = gemini_answer(
        user_input,
        results
    )

    return {
        "answer": answer
    }
