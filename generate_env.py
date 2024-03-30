import os
import secrets
import string


def generate_secret_key(length=32):
    # Define the character pool including numbers, uppercase, and lowercase letters
    characters = string.ascii_letters + string.digits  # This includes [a-zA-Z0-9]
    # Generate a random secret key from the pool
    key = ''.join(secrets.choice(characters) for _ in range(length))
    return key


def load_chatgpt_credentials(file_path='chatgpt_credentials.env'):
    # Initialize a dictionary to hold the credentials
    credentials = {}
    try:
        # Open the credentials file and read the contents
        with open(file_path, 'r') as file:
            for line in file:
                # Split each line by the equals sign into key and value
                key, value = line.strip().split('=', 1)
                credentials[key] = value
    except FileNotFoundError:
        print(f"Warning: {file_path} not found. Skipping ChatGPT credentials.")
    return credentials


def generate_nextjs_env_file(static_bearer_secret_key):  # noqa
    nextjs_env_content = f"""
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_KEY={static_bearer_secret_key}
"""
    nextjs_folder_path = "./nextjs"
    if not os.path.exists(nextjs_folder_path):
        os.makedirs(nextjs_folder_path)

    with open(os.path.join(nextjs_folder_path, '.env'), 'w') as file:
        file.write(nextjs_env_content)


def main():
    mongodb_fastapi_password = generate_secret_key(length=16)  # New password for MongoDB and FastAPI UI
    chatgpt_credentials = load_chatgpt_credentials()
    static_bearer_secret_key = generate_secret_key(length=32)

    # Prepare the settings with the generated static_bearer_secret_key
    env_content = f"""
# You can set your backend settings here.

# mongodb connection
mongodb_server=mongodb
mongodb_port=27017
mongodb_username=bringthemhome
mongodb_password={mongodb_fastapi_password}

# fastapi
fastapi_ui_username=bringthemhome
fastapi_ui_password=bringthemhome

# static_bearer_secret_key to protect your register from unauthorized access
static_bearer_secret_key={static_bearer_secret_key}
jwt_secret_key=bringthemhome
algorithm=HS256

# chatgpt
open_ai_organization={chatgpt_credentials.get('open_ai_organization', 'this')}
open_ai_secret_key={chatgpt_credentials.get('open_ai_secret_key', 'this')}

# default admin user
owner_username=root
owner_password=bringthemhome
owner_email=israel@israeli.com
""".strip()

    # Write the combined content to an .env file
    with open('.env', 'w') as file:
        file.write(env_content)

    generate_nextjs_env_file(static_bearer_secret_key)

    print("Generated .env with keys and additional settings")
    print("Generated .env for Next.js")


if __name__ == "__main__":
    main()
