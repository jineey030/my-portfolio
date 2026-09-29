import os
import json

from dotenv import load_dotenv
from google import genai

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# =========================================================
# Google Gemini
# =========================================================

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


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
        "parameters": {},
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
        "parameters": {},
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
        "parameters": {},
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
        "parameters": {},
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
# Tool Definition
# =========================================================

def get_tool_definitions():

    definitions = []

    for name, tool in tools.items():

        definitions.append({
            "name": name,
            "description": tool["description"],
            "parameters": tool["parameters"]
        })

    return definitions


# =========================================================
# Gemini Tool Definition
# =========================================================

def get_gemini_tools(tool_names):

    gemini_tools = []

    for tool_name in tool_names:

        tool = tools.get(tool_name)

        if tool is None:
            continue

        gemini_tools.append({
            "type": "function",
            "name": tool_name,
            "description": tool["description"],
            "parameters": tool["parameters"]
        })

    return gemini_tools


# =========================================================
# Tool 선택
# =========================================================

def select_tools(user_input):

    user_input = user_input.lower()

    requested_tools = []

    for tool_name, tool in tools.items():

        keywords = tool["keywords"]

        for keyword in keywords:

            if keyword.lower() in user_input:

                requested_tools.append(tool_name)

                break

    return requested_tools


# =========================================================
# Tool 실행
# =========================================================

def execute_tool(tool_name):

    tool = tools.get(tool_name)

    if tool is None:

        return {
            "error": f"존재하지 않는 Tool입니다: {tool_name}"
        }

    tool_function = tool["function"]

    return tool_function()


# =========================================================
# AI 답변 생성
# =========================================================

def generate_answer(results):

    answer_parts = []

    # =====================================================
    # Profile
    # =====================================================

    if "get_profile" in results:

        profile = results["get_profile"]

        answer_parts.append(
            f"{profile['name']}님은 "
            f"{profile['introduction']}."
        )

    # =====================================================
    # Skills
    # =====================================================

    if "get_skills" in results:

        skills = results["get_skills"]

        frontend = ", ".join(skills["frontend"])
        backend = ", ".join(skills["backend"])
        database = ", ".join(skills["database"])

        answer_parts.append(
            "🛠️ 기술 스택\n"
            f"Frontend: {frontend}\n"
            f"Backend: {backend}\n"
            f"Database: {database}"
        )

    # =====================================================
    # Projects
    # =====================================================

    if "get_projects" in results:

        projects = results["get_projects"]

        for project in projects:

            stack = ", ".join(project["stack"])

            answer_parts.append(
                "👩‍💻 프로젝트\n"
                f"{project['name']}\n"
                f"{project['description']}.\n"
                f"사용 기술: {stack}"
            )

    # =====================================================
    # Learning
    # =====================================================

    if "get_learning" in results:

        learning = results["get_learning"]

        current = ", ".join(learning["current"])

        answer_parts.append(
            "🤓 현재 공부하고 있는 내용\n"
            f"{current}\n\n"
            f"🔔 학습 목표는 {learning['goal']}입니다."
        )

    return "\n\n".join(answer_parts)


# =========================================================
# Fake AI
# =========================================================

def fake_ai(
    user_input,
    tool_definitions,
    tool_results,
    messages
):

    used_tools = {
        result["tool_name"]
        for result in tool_results
    }

    requested_tools = select_tools(user_input)

    # =====================================================
    # 아직 실행하지 않은 Tool 찾기
    # =====================================================

    for tool_name in requested_tools:

        if tool_name not in used_tools:

            return {
                "type": "tool_call",
                "tool_name": tool_name,
                "arguments": {}
            }

    # =====================================================
    # 모든 Tool 실행 완료
    # =====================================================

    all_tools_used = all(
        tool_name in used_tools
        for tool_name in requested_tools
    )

    if all_tools_used and requested_tools:

        results = {
            result["tool_name"]: result["result"]
            for result in tool_results
        }

        answer = generate_answer(results)

        return {
            "type": "final_answer",
            "content": answer
        }

    # =====================================================
    # 이해하지 못한 질문
    # =====================================================

    return {
        "type": "final_answer",
        "content": (
            "음, 아직 그 질문에는 정확하게 답변하기 어려워요. 😅\n\n"
            "예진의 개발자 소개, 기술 스택, 프로젝트, "
            "현재 공부하고 있는 내용에 대해서는 알려드릴 수 있습니다."
        )
    }


# =========================================================
# Gemini AI Agent
# =========================================================

def gemini_agent(user_input):

    # =====================================================
    # STEP 1
    # 로컬에서 필요한 Tool 후보 찾기
    #
    # 이 과정에서는 Gemini API 호출이 발생하지 않는다.
    # =====================================================

    requested_tools = select_tools(user_input)

    print("\n===== 로컬 Tool 선택 =====")
    print("요청:", user_input)
    print("Tool 후보:", requested_tools)

    # =====================================================
    # STEP 2
    # Tool이 필요 없는 질문
    #
    # Gemini 1회만 호출
    # =====================================================

    if not requested_tools:

        print("\n===== Gemini 호출 =====")
        print("Tool 없이 일반 답변 생성")

        interaction = client.interactions.create(
            model="gemini-3.8-flash",
            input=user_input
        )

        return interaction.output_text

    # =====================================================
    # STEP 3
    # 필요한 Tool만 Gemini에게 전달
    # =====================================================

    gemini_tools = get_gemini_tools(
        requested_tools
    )

    print("\n===== Gemini 호출 =====")
    print("Gemini에게 전달하는 Tool:", requested_tools)

    # =====================================================
    # STEP 4
    # Gemini 첫 번째 호출
    #
    # 목적:
    # 어떤 Tool을 사용할지 판단
    # =====================================================

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=user_input,
        tools=gemini_tools
    )

    # =====================================================
    # STEP 5
    # Gemini가 요청한 모든 Function Call 수집
    # =====================================================

    function_calls = [
        step
        for step in interaction.steps
        if step.type == "function_call"
    ]

    # =====================================================
    # Tool 호출이 없는 경우
    # =====================================================

    if not function_calls:

        return interaction.output_text

    print("\n===== Gemini Tool Call =====")

    # =====================================================
    # STEP 6
    # 모든 Tool 실행
    #
    # Gemini를 Tool마다 다시 호출하지 않는다.
    # =====================================================

    function_results = []

    for function_call in function_calls:

        tool_name = function_call.name

        print(
            f"Tool 호출: {tool_name}"
        )

        print(
            f"arguments: {function_call.arguments}"
        )

        tool_result = execute_tool(
            tool_name
        )

        print(
            f"Tool 결과: {tool_result}"
        )

        function_results.append({
            "type": "function_result",
            "name": tool_name,
            "call_id": function_call.id,
            "result": [
                {
                    "type": "text",
                    "text": json.dumps(
                        tool_result,
                        ensure_ascii=False
                    )
                }
            ]
        })

    # =====================================================
    # STEP 7
    # 모든 Tool 결과를 한 번에 Gemini에게 전달
    #
    # Gemini 두 번째 호출
    # =====================================================

    print("\n===== Gemini 최종 답변 호출 =====")

    final_interaction = client.interactions.create(
        model="gemini-3.8-flash",
        previous_interaction_id=interaction.id,
        input=function_results
    )

    # =====================================================
    # STEP 8
    # 최종 답변
    # =====================================================

    return final_interaction.output_text


# =========================================================
# FastAPI
# =========================================================

app = FastAPI()


# =========================================================
# CORS
# =========================================================

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

    answer = gemini_agent(
        user_input
    )

    return {
        "answer": answer
    }


# =========================================================
# Local Test
# =========================================================

def test_gemini():

    answer = gemini_agent(
        "예진이 사용하는 기술 스택을 알려줘."
    )

    print("\n===== 최종 답변 =====")
    print(answer)


# =========================================================
# Main
# =========================================================

if __name__ == "__main__":

    test_gemini()
