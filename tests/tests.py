from app.components.message_dispatcher.mail import manual_send_test_email


def test_smtp():
    smtp_server = "smtp.gmail.com"
    port = 587  # Use 465 for SSL
    sender_email = "your_email"
    receiver_email = "send_to_where"
    password = "smtp_password" # noqa
    subject = "Test Email"
    body = "This is the body of the test email."
    manual_send_test_email(smtp_server, port, sender_email, receiver_email, password, subject, body)