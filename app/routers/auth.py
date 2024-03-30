from datetime import timedelta
from typing import Any

from fastapi import APIRouter, HTTPException, Depends, status, Header, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from app.classes.Auth import SimpleAuthForm
from app.components.auth.jwt_token_handler import create_jwt_access_token
from app.components.logger import logger
from app.db.mongoClient import async_database

router = APIRouter()

user_collection = async_database.users  # Get the collection from the database
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # setup password hashing context
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # Dependency


async def authenticate_user(username: str, password: str):
    """
    Authenticate the user by connecting to MongoDB asynchronously and checking the password.
    :param username:
    :param password:
    :return:
    """
    user = await user_collection.find_one({"username": username})  # Use `await` for async operation
    if not user:
        return False
    if not pwd_context.verify(password, user.get("hashed_password")):  # Verify the password
        return False
    return user


@router.post("/token")
async def login_for_access_token(request: Request, form_data: SimpleAuthForm = Depends()):
    """
    Log-in and generate access token.

    :param request: The request object, providing access to HTTP request properties.
    :param form_data: The form data from the login request, containing the username and password.
    :return: A JSON object containing the access token and token type.

    This endpoint verifies the user's credentials. If valid, it generates a JWT access token that the user
    can use for authenticated requests. The token includes a 'sub' claim containing the username, and it
    has a default expiration time. This token is also stored in Redis with an expiration time for validation
    on subsequent requests.
    """
    try:
        # Authenticate the user
        user: dict | Any = await authenticate_user(form_data.username, form_data.password)
        if not user:
            logger.warning(f"Login attempt failed for user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

        # Specify token expiration duration
        access_token_expires = timedelta(minutes=30)  # Token validity can be adjusted

        # Create JWT access token
        access_token = await create_jwt_access_token(
            request=request,
            data={"sub": user["username"]},  # 'sub' claim to include the username
            expires_delta=access_token_expires
        )

        logger.info(f"Login successful for user: {form_data.username}")
        return {"access_token": access_token, "token_type": "bearer"}

    except HTTPException:  # Catch and re-raise HTTPException to ensure it stops execution
        raise

    except Exception as e:
        logger.error(f"An error occurred during login attempt: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during the login process."
        )


@router.post("/logout")
async def logout(request: Request, api_key: str = Header(...)):
    """
    Invalidate the user's current JWT token to log them out.
    """
    try:
        token_key = f"API_KEY_{api_key}"
        # Use the async get_instance method to get the Redis client
        redis_client = request.app.state.redis

        # Async call to check if the token exists
        token_exists = await redis_client.exists(token_key)
        if not token_exists:
            raise HTTPException(status_code=404, detail="Token not found or already invalidated")

        # Invalidate the token by deleting it from Redis asynchronously
        await redis_client.delete(token_key)
        return {"message": "Logged out successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )
