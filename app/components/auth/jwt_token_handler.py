import os
from datetime import datetime, timedelta

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, Header, Request

# from app.db.mongoClient import database

load_dotenv()

# Secret key for JWT encoding and decoding. In a real app, keep this secret and safe!
SECRET_KEY = os.environ["jwt_secret_key"]  # Ensure this is corrected
ALGORITHM = os.environ["algorithm"]


async def create_jwt_access_token(request: Request, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()  # data copy is required for jwt.encode() to work
    user_id = data["sub"]  # Get the user_id from the payload
    redis_client = request.app.state.redis

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=120)  # Token expires in 120 minutes by default
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # Token expiration in seconds (2 days)
    token_expiration_seconds = 48 * 60 * 60

    # Key for storing the mapping of user_id to their token
    user_key = f"USER_{user_id}_API_KEY"

    # Check if this user already has a token
    existing_api_key = await redis_client.get(user_key)
    if existing_api_key:
        # Delete the old token to invalidate it
        await redis_client.delete(f"API_KEY_{existing_api_key}")

    # Store the new token in Redis
    api_key = f"API_KEY_{encoded_jwt}"  # Unique key for each user's token
    await redis_client.setex(api_key, token_expiration_seconds, user_id)  # Storing user_id for reference, if needed

    # Update the user's current active token mapping
    await redis_client.setex(user_key, token_expiration_seconds, encoded_jwt)

    return encoded_jwt


async def get_jwt_secret_key(request: Request, api_key: str = Header(...)):
    redis_client = request.app.state.redis

    token_key = f"API_KEY_{api_key}"
    token_exists = await redis_client.exists(token_key)
    if not token_exists:
        raise HTTPException(status_code=401, detail="API key is invalid or has expired")
    # If the key exists, you might want to return something or just let the request pass
    return api_key


async def get_user_id_from_jwt(token: str):
    """
    Extracts the user ID from the provided JWT token.
    :param token:
    :return:
    """
    try:
        # Decode the JWT without verification just to extract user ID
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_signature": False})
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid JWT token: No user ID (sub) present.")
        return user_id
    except jwt.PyJWTError as e:
        # Handle decoding errors (e.g., token is malformed)
        raise HTTPException(status_code=400, detail=f"Invalid JWT token: {e}")


async def get_username_from_api_key(request: Request, api_key: str = Header(...)):
    """
    Extracts the username (user_id) from the provided API key (JWT token).
    Optionally verifies if the token is still valid and not expired.
    """
    redis_client = request.app.state.redis

    # Extract user_id from the JWT token
    user_id = get_user_id_from_jwt(api_key)

    # Here you might want to verify if the token is still valid by checking
    # if it exists in Redis or if it's not expired, depending on your application logic.

    # Assuming redisClient is already connected and setup
    token_exists = await redis_client.exists(f"API_KEY_{api_key}")
    if not token_exists:
        raise HTTPException(status_code=401, detail="API key is invalid or has expired")

    # Return the user_id if everything is valid
    return user_id


async def get_jwt_username(api_key: str = Header(...)):
    try:
        payload = jwt.decode(api_key, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub", None)
        if not username:
            raise HTTPException(status_code=401, detail="Invalid JWT token: Username missing")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid JWT token")