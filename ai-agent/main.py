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

def fake_ai(user_input, tool_definitions, tool_results, messages):
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
    # 대화 문맥 확인
    # =========================

    previous_user_messages = [
        message.content.lower()
        for message in messages
        if message.role == "user"
    ]

    has_skill_context = any(
        "기술" in message
        or "스택" in message
        or "skill" in message
        or "backend" in message
        or "frontend" in message
        for message in previous_user_messages[:-1]
    )

    # =========================
    # Tool 선택
    # =========================
    wants_profile = (
        "개발자" in user_input
        or "소개" in user_input
        or "누구" in user_input
        or "어떤 사람" in user_input
        or "프로필" in user_input
    )

    wants_skills = (
        "기술" in user_input
        or "스택" in user_input
        or "사용하는 기술" in user_input
        or "무슨 기술" in user_input
    )

    wants_projects = (
        "프로젝트" in user_input
        or "만든 것" in user_input
        or "무엇을 만들었" in user_input
        or "작업" in user_input
    )

    wants_learning = (
        "공부" in user_input
        or "학습" in user_input
        or "배우" in user_input
        or "요즘 뭐" in user_input
    )

    # =========================
    # 요청된 Tool 확인
    # =========================

    requested_tools = []

    if wants_profile:
        requested_tools.append("get_profile")

    if wants_skills:
        requested_tools.append("get_skills")

    if wants_projects:
        requested_tools.append("get_projects")

    if wants_learning:
        requested_tools.append("get_learning")

    # =========================
    # Tool 실행 요청
    # =========================

    for tool_name in requested_tools:

        if tool_name not in used_tools:

            return {
                "type": "tool_call",
                "tool_name": tool_name,
                "arguments": {}
            }

    # =========================
    # 모든 요청 Tool 실행 여부 확인
    # =========================

    all_tools_used = all(
        tool_name in used_tools
        for tool_name in requested_tools
    )

    print("모든 Tool 실행 완료:", all_tools_used)

    # =========================
    # Tool 결과 확인
    # =========================

    if all_tools_used:

        print("모든 Tool의 결과를 가지고 있습니다.")

        results = {
            result["tool_name"]: result["result"]
            for result in tool_results
        }

        print("수집된 결과:", results)

        profile = results["get_profile"]
        skills = results["get_skills"]
        projects = results["get_projects"]
        learning = results["get_learning"]

        frontend = ", ".join(skills["frontend"])
        backend = ", ".join(skills["backend"])
        database = ", ".join(skills["database"])

        current = ", ".join(learning["current"])

        project = projects[0]

        stack = ", ".join(project["stack"])

        return {
            "type": "final_answer",
            "content": (
                f"{profile['name']}님은 "
                f"{profile['introduction']}.\n\n"

                "🛠️ 기술 스택\n"
                f"Frontend: {frontend}\n"
                f"Backend: {backend}\n"
                f"Database: {database}\n\n"

                "👩‍💻 프로젝트\n"
                f"{project['name']}\n"
                f"{project['description']}.\n"
                f"사용 기술: {stack}\n\n"

                "🤓 현재 공부하고 있는 내용\n"
                f"{current}\n\n"

                f"🔔 학습 목표는 {learning['goal']}입니다."
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

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    messages: list[ChatMessage]

@app.post("/chat")
def chat(request: ChatRequest):

    user_input = request.message
    messages = request.messages

    tool_definitions = get_tool_definitions()

    tool_results = []

    while True:

        ai_response = fake_ai(
            user_input,
            tool_definitions,
            tool_results,
            messages
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
