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
    ) and not has_profile:

        return {
            "type": "tool_call",
            "tool_name": "get_profile",
            "arguments": {}
        }

    if (
        "기술" in user_input
        or "스택" in user_input
    ) and not has_skills:

        return {
            "type": "tool_call",
            "tool_name": "get_skills",
            "arguments": {}
        }

    if (
        "프로젝트" in user_input
        or "만든 것" in user_input
    ) and not has_projects:

        return {
            "type": "tool_call",
            "tool_name": "get_projects",
            "arguments": {}
        }

    if (
        "공부" in user_input
        or "학습" in user_input
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

        if result["tool_name"] == "get_profile":

            profile = result["result"]

            return {
                "type": "final_answer",
                "content": (
                    f"{profile['name']}님은 "
                    f"{profile['introduction']}"
                )
            }

        if result["tool_name"] == "get_skills":

            skills = result["result"]

            frontend = ", ".join(skills["frontend"])
            backend = ", ".join(skills["backend"])
            database = ", ".join(skills["database"])

            return {
                "type": "final_answer",
                "content": (
                    f"Frontend: {frontend}\n"
                    f"Backend: {backend}\n"
                    f"Database: {database}"
                )
            }

        if result["tool_name"] == "get_projects":

            projects = result["result"]

            project = projects[0]

            stack = ", ".join(project["stack"])

            return {
                "type": "final_answer",
                "content": (
                    f"{project['name']}를 만들었습니다.\n"
                    f"{project['description']}\n"
                    f"기술 스택: {stack}"
                )
            }

        if result["tool_name"] == "get_learning":

            learning = result["result"]

            current = ", ".join(learning["current"])

            return {
                "type": "final_answer",
                "content": (
                    f"현재 {current}를 공부하고 있습니다.\n"
                    f"목표: {learning['goal']}"
                )
            }

    return {
        "type": "final_answer",
        "content": "질문을 이해하지 못했어요."
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


# =========================
# Agent Loop
# =========================

# user_input = input("질문: ")

# tool_definitions = get_tool_definitions()

# tool_results = []


# while True:

#     # 1. AI에게 현재 상황을 전달하고 판단 받기
#     ai_response = fake_ai(
#         user_input,
#         tool_definitions,
#         tool_results
#     )

#     print()
#     print("AI 판단:", ai_response)

#     # =========================
#     # 2. 최종 답변이면 종료
#     # =========================

#     if ai_response["type"] == "final_answer":

#         print()
#         print("AI 최종 답변:")
#         print(ai_response["content"])

#         break

#     # =========================
#     # 3. Tool 호출 요청이면 실행
#     # =========================

#     if ai_response["type"] == "tool_call":

#         tool_name = ai_response["tool_name"]

#         print()
#         print("호출할 Tool:", tool_name)

#         # Registry에서 Tool 찾기
#         tool = tools.get(tool_name)

#         if tool is None:

#             tool_result = {
#                 "error": f"존재하지 않는 Tool입니다: {tool_name}"
#             }

#         else:

#             # 실제 Python 함수 가져오기
#             tool_function = tool["function"]

#             # 함수 실행
#             tool_result = tool_function()

#             print("Tool 결과:")
#             print(tool_result)

#         # Tool 실행 결과 저장
#         tool_results.append({
#             "tool_name": tool_name,
#             "result": tool_result
#         })
