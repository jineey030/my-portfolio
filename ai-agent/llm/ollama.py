import ollama


MODEL = "qwen3:4b"


def ask_ollama(prompt: str) -> str:

    response = ollama.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]
