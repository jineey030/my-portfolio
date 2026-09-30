import os
import json

from dotenv import load_dotenv
from google import genai


# =========================================================
# Google Gemini
# =========================================================

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# =========================================================
# Gemini 자연어 답변
# =========================================================

def gemini_answer(user_input, results):

    context = json.dumps(
        results,
        ensure_ascii=False
    )

    prompt = f"""
당신은 개발자 예진이의 포트폴리오를 소개하는 AI입니다.

반드시 아래 데이터에 있는 정보만 사용하세요.
없는 정보는 만들어내지 마세요.

[포트폴리오 데이터]
{context}

[사용자 질문]
{user_input}

위 데이터를 기반으로 자연스럽고 간결하게 답변해주세요.

답변은 딱딱한 데이터 나열보다는
사람이 직접 설명해주는 것처럼 자연스럽게 작성해주세요.

질문과 관련된 정보만 답변하고,
관련 없는 정보는 불필요하게 추가하지 마세요.
"""

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    return interaction.output_text