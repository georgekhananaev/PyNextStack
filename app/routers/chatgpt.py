from fastapi import APIRouter, Depends
from starlette.responses import JSONResponse

from app.classes.Chatgpt import ChatGptModelEnum
from app.components.auth.check_permissions import check_permissions
from app.components.chat_gpt.chatgpt_service import ask_chatgpt_with_context

router = APIRouter()  # loading the FastAPI app


@router.get("/chat/", dependencies=[Depends(check_permissions)])
async def chat_with_gpt(question: str, model: ChatGptModelEnum):
    """
    Chat with ChatGPT
    """
    answer = ask_chatgpt_with_context(question, model)
    return JSONResponse(content={"message": answer})
