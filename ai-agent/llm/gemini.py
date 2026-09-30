import os

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
# Gemini
# =========================================================

def ask_gemini(prompt: str) -> str:

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    return interaction.output_text
