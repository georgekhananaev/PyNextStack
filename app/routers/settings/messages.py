from typing import List

from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.classes.Messages import MessagesConfigModel
from app.components.message_dispatcher.mail import send_email_and_save, test_email_connection
from app.db.mongoClient import async_mdb_client, async_database

router = APIRouter()

# mongo connection
config_collection = async_database.settings
emails_collection = async_mdb_client.messages.emails_sent


@router.get("/config", response_model=MessagesConfigModel)
async def get_config():
    """Fetch a specific configuration object from the database.

       Raises a 404 error if the configuration cannot be found.
    """

    config_id = "65fdaaca4f94194ff730d3be"  # noqa
    config = await config_collection.find_one({"_id": ObjectId(config_id)})  # Use ObjectId to convert the config_id
    if config:
        return config
    else:
        raise HTTPException(status_code=404, detail="Configuration not found")


@router.put("/config", response_model=MessagesConfigModel)
async def update_config(config: MessagesConfigModel):
    """Update an existing configuration object in the database.

        If the specified configuration does not exist, a 404 error is raised.
        This method ensures that the MongoDB document structure is respected during the update.
    """
    config_id = "65fdaaca4f94194ff730d3be"  # noqa
    # Use ObjectId to convert the config_id
    existing_config = await config_collection.find_one({"_id": ObjectId(config_id)})
    if existing_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found")
    # Need to ensure that the conversion to dictionary (if necessary) and merging with updates respects MongoDB's document structure and idiosyncrasies
    updated_config = {**existing_config, **config.dict(exclude_unset=True)}
    # When replacing, you also need to make sure the _id is not altered. Since ObjectId is not JSON serializable, exclude it from the update.
    updated_config.pop('_id', None)  # Remove _id if present, to avoid issues with MongoDB's _id immutability
    await config_collection.replace_one({"_id": ObjectId(config_id)}, updated_config)
    return updated_config


@router.post("/test-email/")
async def test_email_route():
    """Tests the email system connectivity and configuration.

       If the test fails, a 500 internal server error is returned with the error details.
    """
    try:
        result = await test_email_connection()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/send-email/")
async def send_email(
        subject: str = Form(...),
        body: str = Form(...),
        to_emails: List[str] = Form(...),
        files: List[UploadFile] = File([])
):
    """Sends an email and saves its details to the database.

       The email is sent to the specified recipient(s) with optional file attachments.
    """
    return await send_email_and_save(subject, body, to_emails, files)

