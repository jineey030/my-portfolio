from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# =========================
# Tool
# =========================

def get_profile():
    return {
        "name": "오예진",
        "role": "개발자",
        "introduction": "React와 Kotlin으로 배우고, 만들면서 성장하는 개발자"
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

# =========================
# Tool Registry
# =========================

tools = {
    "get_profile": {
        "function": get_profile,
        "description": "예진의 기본 프로필 정보를 가져옵니다.",
        "parameters": {}
    },

    "get_skills": {
        "function": get_skills,
        "description": "예진이 사용하는 기술 스택 정보를 가져옵니다.",
        "parameters": {}
    },

    "get_projects": {
        "function": get_projects,
        "description": "예진이 만든 프로젝트 정보를 가져옵니다.",
        "parameters": {}
    },

    "get_learning": {
        "function": get_learning,
        "description": "예진이 현재 공부하고 있는 내용을 가져옵니다.",
        "parameters": {}
    }
}

# =========================
# Tool Definition
# =========================
def get_tool_definitions():

    definitions = []

    for name, tool in tools.items():

        definitions.append({
            "name": name,
            "description": tool["description"],
            "parameters": tool["parameters"]
        })

    return definitions

# =========================
# Fake AI
# =========================

def fake_ai(user_input, tool_definitions, tool_results):

    used_tools = {
        result["tool_name"]
        for result in tool_results
    }

    has_profile = "get_profile" in used_tools
    has_skills = "get_skills" in used_tools
    has_projects = "get_projects" in used_tools
    has_learning = "get_learning" in used_tools

    user_input = user_input.lower()

    # =========================
    # Tool 선택
    # =========================

    if (
        "개발자" in user_input
        or "소개" in user_input
        or "누구" in user_input
        or "어떤 사람" in user_input
    ) and not has_profile:

        return {
            "type": "tool_call",
            "tool_name": "get_profile",
            "arguments": {}
        }

    if (
        "기술" in user_input
        or "스택" in user_input
        or "사용하는 기술" in user_input
        or "무슨 기술" in user_input
    ) and not has_skills:

        return {
            "type": "tool_call",
            "tool_name": "get_skills",
            "arguments": {}
        }

    if (
        "프로젝트" in user_input
        or "만든 것" in user_input
        or "무엇을 만들었" in user_input
        or "작업" in user_input
    ) and not has_projects:

        return {
            "type": "tool_call",
            "tool_name": "get_projects",
            "arguments": {}
        }

    if (
        "공부" in user_input
        or "학습" in user_input
        or "배우" in user_input
        or "요즘 뭐" in user_input
    ) and not has_learning:

        return {
            "type": "tool_call",
            "tool_name": "get_learning",
            "arguments": {}
        }

    # =========================
    # Tool 결과 확인
    # =========================

    for result in tool_results:

        # =========================
        # Profile
        # =========================

        if result["tool_name"] == "get_profile":

            profile = result["result"]

            return {
                "type": "final_answer",
                "content": (
                    f"안녕하세요! 저는 {profile['name']}님의 포트폴리오를 "
                    f"소개해드리는 AI Assistant입니다.\n\n"
                    f"{profile['name']}님은 "
                    f"{profile['introduction']}.\n\n"
                    f"프론트엔드와 백엔드를 함께 공부하면서 "
                    f"배운 내용을 실제 서비스로 구현하는 것을 좋아합니다."
                )
            }

        # =========================
        # Skills
        # =========================

        if result["tool_name"] == "get_skills":

            skills = result["result"]

            frontend = ", ".join(skills["frontend"])
            backend = ", ".join(skills["backend"])
            database = ", ".join(skills["database"])

            return {
                "type": "final_answer",
                "content": (
                    "현재 사용하고 있는 기술은 다음과 같습니다.\n\n"
                    f"Frontend: {frontend}\n"
                    f"Backend: {backend}\n"
                    f"Database: {database}\n\n"
                    "React와 TypeScript를 활용한 프론트엔드 개발과 "
                    "Kotlin, Spring Boot를 활용한 백엔드 개발을 "
                    "함께 경험하고 있습니다."
                )
            }

        # =========================
        # Projects
        # =========================

        if result["tool_name"] == "get_projects":

            projects = result["result"]

            project = projects[0]

            stack = ", ".join(project["stack"])

            return {
                "type": "final_answer",
                "content": (
                    f"현재 소개할 수 있는 프로젝트는 "
                    f"'{project['name']}'입니다.\n\n"
                    f"{project['description']}.\n\n"
                    f"사용한 기술은 {stack}입니다.\n\n"
                    "프론트엔드부터 백엔드, 데이터베이스까지 "
                    "전체 흐름을 직접 구현해보는 것을 목표로 만든 프로젝트입니다."
                )
            }

        # =========================
        # Learning
        # =========================

        if result["tool_name"] == "get_learning":

            learning = result["result"]

            current = ", ".join(learning["current"])

            return {
                "type": "final_answer",
                "content": (
                    f"요즘은 {current}를 중심으로 공부하고 있습니다.\n\n"
                    f"특히 {learning['goal']}을 목표로 "
                    "하나씩 직접 구현해보면서 익히고 있습니다.\n\n"
                    "최근에는 AI Agent와 MCP까지 공부하면서 "
                    "기존 웹 개발 경험과 AI 기술을 연결해보는 중입니다."
                )
            }

    # =========================
    # 이해하지 못한 질문
    # =========================

    return {
        "type": "final_answer",
        "content": (
            "음, 아직 그 질문에는 정확하게 답변하기 어려워요. 😅\n\n"
            "예진의 개발자 소개, 기술 스택, 프로젝트, "
            "현재 공부하고 있는 내용에 대해서는 알려드릴 수 있습니다."
        )
    }

# =========================
# Api
# =========================
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

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(request: ChatRequest):

    user_input = request.message

    tool_definitions = get_tool_definitions()

    tool_results = []

    while True:

        ai_response = fake_ai(
            user_input,
            tool_definitions,
            tool_results
        )

        if ai_response["type"] == "final_answer":

            return {
                "answer": ai_response["content"]
            }

        if ai_response["type"] == "tool_call":

            tool_name = ai_response["tool_name"]

            tool = tools.get(tool_name)

            if tool is None:

                tool_result = {
                    "error": f"존재하지 않는 Tool입니다: {tool_name}"
                }

            else:

                tool_function = tool["function"]

                tool_result = tool_function()

            tool_results.append({
                "tool_name": tool_name,
                "result": tool_result
            })
