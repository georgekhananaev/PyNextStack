import logging
import os

import httpx
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("open_ai_secret_key")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def ask_chatgpt_with_context(gpt_question: str, model: str = "gpt-3.5-turbo"):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": gpt_question}
        ]
    }

    try:
        with httpx.Client() as client:
            response = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return ''.join(choice['message']['content'] for choice in data['choices'] if
                           'message' in choice and 'content' in choice['message'])
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error occurred: {e}")
    except httpx.RequestError as e:
        logger.error(f"Request error occurred: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
    return "Error: Unable to fetch response."

# Example usage
if __name__ == "__main__":
    question = "Which nation founded Jerusalem and has the strongest connection with it throughout known history?"
    print(ask_chatgpt_with_context(question))
