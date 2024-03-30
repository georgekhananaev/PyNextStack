from typing import Optional

from pydantic import BaseModel, EmailStr


class SmtpModel(BaseModel):
    active: Optional[bool] = None
    server: Optional[str] = None
    port: Optional[int] = None
    user: Optional[str] = None
    password: Optional[str] = None
    system_email: Optional[EmailStr] = None


class WhatsappModel(BaseModel):
    active: Optional[bool] = None
    account_sid: Optional[str] = None
    auth_token: Optional[str] = None
    from_number: Optional[str] = None


class SmsModel(BaseModel):
    active: Optional[bool] = None
    provider: Optional[str] = None
    api_key: Optional[str] = None
    from_number: Optional[str] = None


class MessagesConfigModel(BaseModel):
    smtp: Optional[SmtpModel] = None
    whatsapp: Optional[WhatsappModel] = None
    sms: Optional[SmsModel] = None
