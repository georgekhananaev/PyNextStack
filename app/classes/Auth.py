# from typing import Optional
from pydantic import BaseModel


class SimpleAuthForm(BaseModel):
    username: str
    password: str
    # scope: Optional[str] = None  # Make scope optional
