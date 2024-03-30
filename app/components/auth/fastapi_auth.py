import os
import secrets
from datetime import datetime, timedelta

from dotenv import load_dotenv
from fastapi import HTTPException, Depends, security, status, Request
from fastapi.security import HTTPBasicCredentials, HTTPBasic

# Load environment variables from .env file
load_dotenv()
SECRET_KEY = os.environ["static_bearer_secret_key"]  # loading bearer_secret_key from.env file

# Create an instance of HTTPBearer
http_bearer = security.HTTPBearer()
security_basic = HTTPBasic()


async def get_secret_key(security_payload: security.HTTPAuthorizationCredentials = Depends(http_bearer)):
    """
    This function is used to get the secret key from the authorization header.
    :param security_payload:
    :return:
    """
    authorization = security_payload.credentials
    if not authorization or SECRET_KEY not in authorization:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return authorization


async def get_login_attempts(username: str, request: Request):
    redis_client = request.app.state.redis
    attempts = await redis_client.get(f"{username}:attempts")
    return int(attempts) if attempts else 0


async def get_last_attempt_time(username: str, request: Request):
    """
    This function is used to get the last login attempt time.
    """
    redis_client = request.app.state.redis

    last_time = await redis_client.get(f"{username}:last_attempt")  # This should be awaited
    if last_time:
        return datetime.fromtimestamp(float(last_time))
    return None


async def set_failed_login(username: str, attempts: int, last_attempt_time: datetime, request: Request):
    """
    This function is used to set the number of failed login attempts and the last login attempt time.
    """
    redis_client = request.app.state.redis

    await redis_client.set(f"{username}:attempts", attempts, ex=300)  # 5 minutes expiration
    await redis_client.set(f"{username}:last_attempt", last_attempt_time.timestamp(), ex=300)  # 5 minutes expiration


async def reset_login_attempts(username: str, request: Request):
    """
    This function is used to reset the number of failed login attempts and the last login attempt time.
    """
    redis_client = request.app.state.redis
    await redis_client.delete(f"{username}:attempts", f"{username}:last_attempt")


async def verify_credentials(request: Request, credentials: HTTPBasicCredentials = Depends(security_basic)):
    username = credentials.username
    current_time = datetime.now()

    attempts = await get_login_attempts(username, request)
    last_attempt_time = await get_last_attempt_time(username, request)
    if attempts >= 5 and last_attempt_time and (current_time - last_attempt_time) < timedelta(minutes=5):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="Too many login attempts. Please try again later.")

    correct_username = secrets.compare_digest(credentials.username, os.environ["fastapi_ui_username"])
    correct_password = secrets.compare_digest(credentials.password, os.environ["fastapi_ui_password"])

    if not (correct_username and correct_password):
        await set_failed_login(username, attempts + 1, current_time, request)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    await reset_login_attempts(username, request)

    return credentials