import smtplib
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List

from aiosmtplib import SMTP, SMTPException
from bson import ObjectId
from fastapi import UploadFile, HTTPException

from app.components.logger import logger
from app.db.mongoClient import async_mdb_client, async_database

# mongo connection
config_collection = async_database.settings
emails_collection = async_mdb_client.messages.emails_sent


async def get_config_data(config_key: str):
    config_id = "65fdaaca4f94194ff730d3be"
    config = await config_collection.find_one({"_id": ObjectId(config_id)})
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    return config.get(config_key)


async def send_email_and_save(subject: str, body: str, to_emails: List[str], files: List[UploadFile] = []):  # noqa
    smtp_config = await get_config_data("smtp")
    smtp = None  # Declare smtp here

    # Prepare the email message
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = smtp_config["system_email"]
    msg['To'] = ', '.join(to_emails)
    msg.attach(MIMEText(body, 'plain'))

    # Attach files
    for file in files:
        part = MIMEBase('application', "octet-stream")
        content = await file.read()  # Ensure you read the content here
        part.set_payload(content)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={file.filename}')
        msg.attach(part)

    try:
        smtp = SMTP(hostname=smtp_config["server"], port=smtp_config["port"])
        if smtp_config["port"] == 587:
            await smtp.connect(start_tls=True)
        else:
            # Assuming SSL from the start for port 465 or other SSL ports
            await smtp.connect(use_tls=True)

        await smtp.login(smtp_config["user"], smtp_config["password"])
        await smtp.send_message(msg)

        logger.info("Email sent successfully.")
    except SMTPException as e:
        logger.error(f"Failed to send email. Error: {e}")
        raise
    finally:
        await smtp.quit()

    # Save email details in MongoDB after successful sending
    email_data = {
        "subject": subject,
        "body": body,
        "to_emails": to_emails,
        "attachments": [file.filename for file in files],
    }
    await emails_collection.insert_one(email_data)
    logger.info("Email data saved successfully in MongoDB.")
    return {"message": "Email sent and saved successfully"}


async def test_email_connection():
    smtp_config = await get_config_data("smtp")
    smtp = None  # Declare smtp here

    msg = MIMEMultipart()
    msg['Subject'] = "Test Email Connection"
    msg['From'] = smtp_config["system_email"]
    msg['To'] = "your_email@gmail.com"
    msg.attach(MIMEText("This is a test email to verify SMTP configuration.", 'plain'))

    try:
        smtp = SMTP(hostname=smtp_config["server"], port=smtp_config["port"])
        if smtp_config["port"] == 587:
            await smtp.connect(start_tls=True)
        else:
            await smtp.connect(use_tls=True)  # For SSL from the beginning without STARTTLS
        await smtp.login(smtp_config["user"], smtp_config["password"])
        await smtp.send_message(msg)

        # If email sent successfully, update 'active' to True
        await config_collection.update_one(
            {"_id": ObjectId("65fdaaca4f94194ff730d3be")},
            {"$set": {"smtp.active": True}}
        )
        logger.info("Test email sent successfully. SMTP status set to active.")
        return {"message": "Test email sent successfully. SMTP status set to active."}

    except SMTPException as e:
        # If sending fails, update 'active' to False
        await config_collection.update_one(
            {"_id": ObjectId("65fdaaca4f94194ff730d3be")},
            {"$set": {"smtp.active": False}}
        )
        logger.error(f"Failed to send test email. SMTP status set to inactive. Error: {str(e)}")
        return {"message": f"Failed to send test email. SMTP status set to inactive. Error: {str(e)}"}

    finally:
        await smtp.quit()


async def main():
    await test_email_connection()


def manual_send_test_email(smtp_server, port, sender_email, receiver_email, password, subject, body):
    """
    Send a test email using specified SMTP server settings.

    Parameters:
    smtp_server (str): SMTP server host name.
    port (int): SMTP server port number.
    sender_email (str): The email address sending the email.
    receiver_email (str): The email address receiving the email.
    password (str): Password or app-specific password for the sender's email account.
    subject (str): Subject line of the email.
    body (str): Body content of the email.
    """

    # Create a MIMEText object to represent the email.
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Choose the right connection type based on the port
        if port == 465:
            # Use SMTP_SSL for a direct SSL connection
            server = smtplib.SMTP_SSL(smtp_server, port)
        else:
            # Use SMTP and upgrade to SSL with starttls
            server = smtplib.SMTP(smtp_server, port)
            server.starttls()  # Upgrade the connection to encrypted TLS

        # Log in to the server and send the email
        server.login(sender_email, password)
        server.send_message(msg)  # Using send_message simplifies the API usage
        server.quit()

        logger.info("Email sent successfully!")
    except Exception as e:
        logger.error(f"Failed to send email. Error: {e}")


if __name__ == "__main__":
    manual_send_test_email("smtp.gmail.com", "465", "mhgfallback@gmail.com", "mhgfallback@gmail.com", "password", "Test Email",
                           "This is a test email.")