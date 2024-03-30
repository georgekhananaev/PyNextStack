from typing import List
from fastapi import APIRouter, UploadFile, File, Form
from app.components.message_dispatcher.mail import send_email_and_save

router = APIRouter()



