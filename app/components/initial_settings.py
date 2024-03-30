import os

import pymongo
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv

from app.classes.User import UserCreate
from app.components.logger import logger
from app.db.mongoClient import async_database
from app.routers.users import create_user

load_dotenv()  # loading environment variables


async def check_key_not_expired(redis_client, key):
    """
    Check if a given key exists and thus has not expired.
    """
    # Attempt to get the value for the specified key
    value = redis_client.get(key)

    # If the value exists, the key has not expired
    if value is not None:
        return True
    else:
        return False


async def create_indexes():
    await async_database.users.create_index("email", unique=True)
    await async_database.users.create_index("username", unique=True)

async def create_owner():
    # Fetch owner's email and username from environment variables
    owner_email = os.getenv("owner_email")
    owner_username = os.getenv("owner_username")

    # Assuming async_database.users is your collection from an async database
    user_collection = async_database.users

    # Check if an owner with the same email already exists
    if await user_collection.find_one({"email": owner_email}):
        logger.info(f"An owner with email {owner_email} already exists, skipping creation.")
        return

    # Check if an owner with the same username already exists
    if await user_collection.find_one({"username": owner_username}):
        logger.info(f"An owner with username {owner_username} already exists, skipping creation.")
        return

    # Define the admin user with details from environment variables
    admin_user = {
        "username": owner_username,
        "email": owner_email,
        "full_name": "Site Owner",
        "disabled": False,
        "password": os.getenv("owner_password"),  # Assuming the password is also stored in env variables
        "role": "owner"
    }

    # Create the user with the specified admin user details
    try:
        await create_user(UserCreate(**admin_user), "system_init")
        logger.info("Owner created successfully.")
    except pymongo.errors.DuplicateKeyError:
        logger.info("Owner already exists, skipping creation.")

    logger.info("Owner created successfully.")


async def initialize_message_settings():
    settings_collection = async_database.settings  # Assuming a collection named 'settings'

    # Convert the string ID to an ObjectId
    settings_id = ObjectId("65fdaaca4f94194ff730d3be")

    # Check if settings already exist to avoid duplication
    existing_settings = await settings_collection.find_one({"_id": settings_id})
    if existing_settings:
        logger.info("Message settings already initialized, skipping.")
        return

    # Define the initial settings document with ObjectId for _id
    initial_settings = {
        "_id": settings_id,
        "smtp": {
            "active": False,
            "server": "smtp.gmail.com",
            "port": 587,
            "user": "your_email@gmail.com",
            "password": "your_password",
            "system_email": "your_email@gmail.com"
        },
        "whatsapp": {
            "active": False,
            "account_sid": "your_account_sid",
            "auth_token": "your_auth_token",
            "from_number": "+1234567890"
        },
        "sms": {
            "active": False,
            "provider": "Twilio",
            "api_key": "your_api_key",
            "from_number": "+1234567890"
        }
    }

    # Insert the initial settings document into the database
    await settings_collection.insert_one(initial_settings)
    logger.info("Initial settings have been successfully set up.")
