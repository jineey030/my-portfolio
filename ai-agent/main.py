# 실제 OpenAi 호출 
# from dotenv import load_dotenv
# from openai import OpenAI

# load_dotenv()

# client = OpenAI()

# response = client.responses.create(
#     model="gpt-5.6",
#     input="안녕! 나는 AI Agent를 공부하고 있어."
# )

# print(response.output_text)

# 가짜 Tool Calling 호출
def get_learning_info():
    return {
        "name": "예진",
        "skills": [
            "React",
            "Kotlin",
            "Spring Boot"
        ]
    }


def get_todos():
    return [
        {
            "id": 1,
            "title": "React 공부하기",
            "completed": False
        },
        {
            "id": 2,
            "title": "Kotlin 복습하기",
            "completed": True
        },
        {
            "id": 3,
            "title": "Spring Boot API 만들기",
            "completed": False
        }
    ]


def get_study_logs():
    return [
        {
            "date": "2026-09-21",
            "content": "React 상태 관리 공부"
        },
        {
            "date": "2026-09-22",
            "content": "Kotlin Spring Boot 공부"
        }
    ]


# -----------------------------
# Tool Registry
# -----------------------------

tools = {
    "get_learning_info": get_learning_info,
    "get_todos": get_todos,
    "get_study_logs": get_study_logs
}


# -----------------------------
# Fake AI
# -----------------------------

def fake_ai(user_input):

    if "공부하는 기술" in user_input:
        return {
            "type": "tool_call",
            "tool_name": "get_learning_info",
            "arguments": {}
        }

    if "Todo" in user_input or "todo" in user_input:
        return {
            "type": "tool_call",
            "tool_name": "get_todos",
            "arguments": {}
        }

    if "공부 기록" in user_input:
        return {
            "type": "tool_call",
            "tool_name": "get_study_logs",
            "arguments": {}
        }

    return {
        "type": "final_answer",
        "content": "요청을 이해하지 못했어요."
    }


# -----------------------------
# Agent
# -----------------------------

user_input = input("질문: ")

print("\n사용자:", user_input)

ai_response = fake_ai(user_input)

print("AI 판단:", ai_response)


if ai_response["type"] == "tool_call":

    tool_name = ai_response["tool_name"]

    print("호출할 Tool:", tool_name)

    # Tool Registry에서 Tool 찾기
    tool = tools.get(tool_name)

    if tool is None:

        tool_result = {
            "error": f"존재하지 않는 Tool입니다: {tool_name}"
        }

    else:

        # Tool 실행
        tool_result = tool()

    print("Tool 결과:")
    print(tool_result)

else:

    print("AI:", ai_response["content"])