# 실제 OpenAIU 호출 
# from dotenv import load_dotenv
# from openai import OpenAI

# load_dotenv()

# client = OpenAI()

# response = client.responses.create(
#     model="gpt-5.6",
#     input="안녕! 나는 AI Agent를 공부하고 있어."
# )

# print(response.output_text)
# END

# 가짜 Tool Calling 호출
# =========================
# Tool
# =========================

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


# =========================
# Tool Registry
# =========================

tools = {
    "get_learning_info": {
        "function": get_learning_info,
        "description": "사용자가 공부하고 있는 기술 스택 정보를 가져옵니다.",
        "parameters": {}
    },

    "get_todos": {
        "function": get_todos,
        "description": "사용자의 Todo 목록을 가져옵니다.",
        "parameters": {}
    },

    "get_study_logs": {
        "function": get_study_logs,
        "description": "사용자의 공부 기록을 가져옵니다.",
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

    # 이미 사용한 Tool 확인
    used_tools = {
        result["tool_name"]
        for result in tool_results
    }

    # 어떤 정보가 이미 가져와졌는지 확인
    has_todos = "get_todos" in used_tools
    has_study_logs = "get_study_logs" in used_tools
    has_learning_info = "get_learning_info" in used_tools

    # 사용자가 무엇을 요청했는지 확인
    needs_todos = (
        "todo" in user_input.lower()
        or "할 일" in user_input
    )

    needs_study_logs = (
        "공부 기록" in user_input
    )

    needs_learning_info = (
        "스택" in user_input
        or "공부하는 기술" in user_input
    )

    # =========================
    # 필요한 Tool 호출 요청
    # =========================

    if needs_todos and not has_todos:

        return {
            "type": "tool_call",
            "tool_name": "get_todos",
            "arguments": {}
        }

    if needs_study_logs and not has_study_logs:

        return {
            "type": "tool_call",
            "tool_name": "get_study_logs",
            "arguments": {}
        }

    if needs_learning_info and not has_learning_info:

        return {
            "type": "tool_call",
            "tool_name": "get_learning_info",
            "arguments": {}
        }

    # =========================
    # Tool 결과 가져오기
    # =========================

    todos = None
    study_logs = None
    learning_info = None

    for result in tool_results:

        if result["tool_name"] == "get_todos":
            todos = result["result"]

        elif result["tool_name"] == "get_study_logs":
            study_logs = result["result"]

        elif result["tool_name"] == "get_learning_info":
            learning_info = result["result"]

    # =========================
    # 결과를 최종 답변으로 변환
    # =========================

    summaries = []

    if todos is not None:

        completed_count = sum(
            1
            for todo in todos
            if todo["completed"]
        )

        todo_summary = (
            f"Todo는 총 {len(todos)}개이고 "
            f"완료된 Todo는 {completed_count}개입니다."
        )

        summaries.append(todo_summary)

    if study_logs is not None:

        study_log_summary = (
            f"공부 기록은 총 {len(study_logs)}개입니다."
        )

        summaries.append(study_log_summary)

    if learning_info is not None:

        skills = ", ".join(
            learning_info["skills"]
        )

        learning_info_summary = (
            f"공부하고 있는 기술은 {skills}입니다."
        )

        summaries.append(learning_info_summary)

    # =========================
    # 최종 답변
    # =========================

    if summaries:

        return {
            "type": "final_answer",
            "content": "\n".join(summaries)
        }

    return {
        "type": "final_answer",
        "content": "요청을 이해하지 못했어요."
    }


# =========================
# Agent Loop
# =========================

user_input = input("질문: ")

tool_definitions = get_tool_definitions()

tool_results = []


while True:

    # 1. AI에게 현재 상황을 전달하고 판단 받기
    ai_response = fake_ai(
        user_input,
        tool_definitions,
        tool_results
    )

    print()
    print("AI 판단:", ai_response)

    # =========================
    # 2. 최종 답변이면 종료
    # =========================

    if ai_response["type"] == "final_answer":

        print()
        print("AI 최종 답변:")
        print(ai_response["content"])

        break

    # =========================
    # 3. Tool 호출 요청이면 실행
    # =========================

    if ai_response["type"] == "tool_call":

        tool_name = ai_response["tool_name"]

        print()
        print("호출할 Tool:", tool_name)

        # Registry에서 Tool 찾기
        tool = tools.get(tool_name)

        if tool is None:

            tool_result = {
                "error": f"존재하지 않는 Tool입니다: {tool_name}"
            }

        else:

            # 실제 Python 함수 가져오기
            tool_function = tool["function"]

            # 함수 실행
            tool_result = tool_function()

            print("Tool 결과:")
            print(tool_result)

        # Tool 실행 결과 저장
        tool_results.append({
            "tool_name": tool_name,
            "result": tool_result
        })
