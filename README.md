# PyNextStack a Full-Stack User Management System with FastAPI, Next.js, and MUI & More...


**DEMO: [https://demo-pynextstack.reactatomics.com]()** 

```
Username: root
Password: bringthemhome
```
In the demo version, ChatGPT won't function as it's not connected to the API. Additionally, you can modify the SMTP settings to suit your needs in order to test the forgot-password functionality.
## Overview

PyNextStack is a full-stack system utilizing FastAPI with asynchronous capabilities on the backend and Next.js for the frontend showcases the robustness of Python in server-side development. This architecture provides a scalable, efficient solution that leverages FastAPI's high performance and ease of use for creating APIs, alongside Next.js for a reactive and server-side rendered user interface. The asynchronous nature of the backend ensures non-blocking operation, enhancing the system's ability to handle high volumes of requests simultaneously, which is ideal for real-time applications. This combination offers a modern, full-stack framework that is both powerful and developer-friendly, demonstrating the versatility of Python in web development.

## Key Features

### Security
- **JWT Authentication**: Secure authentication mechanism using JWT to ensure that user actions are verified and secure.
- **Protected API Documentation**: Access to API documentation is restricted, requiring authentication to prevent unauthorized use.
- **Rate Limiting**: Defense against brute force attacks by limiting the number of login attempts.
- **Data Encryption**: Encryption techniques are employed to securely store user data.

### User Management
- **Registration and Login**: Efficient and secure processes for user registration and login.
- **Profile Management**: Enables users to update their profiles and manage account settings.

### Interactivity and Notifications
- **ChatGPT Integration**: Enhances user engagement with AI-driven chat support.
- **Email Notifications**: Sends automated emails for actions such as registration and password resets using SMTP.

### Frontend Experience
- **Next.js and MUI**: A modern, responsive UI built with Next.js and Material-UI for a seamless user experience.
- **Responsive Design**: Ensures a consistent experience across various devices and screen sizes.

### Performance and Scalability
- **Asynchronous Support**: Utilizes FastAPI's async features for efficient performance.
- **Scalable Architecture**: Designed to handle growth in users and data smoothly.

### Logging and Monitoring
- **Comprehensive Logging**: Detailed logging for user actions, system events, and errors.
- **Real-Time Monitoring**: Tools and practices in place for monitoring application performance in real-time.

## Technologies Used

- **FastAPI**: For building the high-performance API backend.
- **Next.js**: The React framework for building the frontend.
- **Material-UI (MUI)**: For designing the frontend with React UI components.
- **MongoDB**: As the NoSQL database for user data.
- **Redis**: For rate limiting and JWT token management.
- **Docker**: For containerizing and deploying the application.
- **Python-JOSE**: A library for JWT operations.
- **SMTP Libraries**: For sending automated email notifications.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Docker**: This project is containerized with Docker, making it necessary to have Docker Desktop (for Windows or Mac) or Docker Engine (for Linux) installed on your system. To install Docker, follow the instructions on the [official Docker website](https://docs.docker.com/get-docker/).

- **Python**: The project requires the latest version of Python for certain local scripts and integrations. To install Python, visit the [official Python website](https://www.python.org/downloads/) and download the latest version for your operating system. Ensure that Python is properly added to your system's PATH to allow for command-line execution.


## Installation
Once you have Docker and Python installed, you're ready to proceed with the project setup. The next sections will guide you through configuring your development environment, running the project with Docker, and executing any necessary Python scripts or commands.


**You can watch this:**

[![IMAGE ALT TEXT HERE](https://i9.ytimg.com/vi/H2oYT-Ame9w/maxresdefault.jpg?v=660965c5&sqp=CNjKpbAG&rs=AOn4CLDdw8xBoa0h7eeR4MRY-U2QDDAwYw)](https://youtu.be/H2oYT-Ame9w)


### Clone the Repository
   ```shell
   git clone https://github.com/georgekhananaev/PyNextStack
   ```

### Docker Installation for Full Deployment (4 Containers)
1. create "chatgpt_credentials.env" file or revise the code in "generate_env.py".

* Example of chatgpt_credentials.env: 
    ```
    open_ai_organization=org-your_openai_key
    open_ai_secret_key=sk-your_openai_key
    ```

2. Run the Installation.


* PowerShell / Linux (Option 1)
    ```shell
    python generate_env.py ; docker-compose build --no-cache ; docker-compose up -d
    ``` 
* CMD (Option 2)
    ```shell
    python generate_env.py && docker-compose build --no-cache && docker-compose up -d
    ```
* Manual (Option 3)
    ```shell
    python generate_env.py
    ```
    ```shell
    docker-compose build --no-cache
    ```
    ```shell
    docker-compose up -d
    ```
  
## Uninstall

  ```shell
  docker-compose down -v
  ```

### If you want to start just the backend (Fastapi)
Just the FastApi server. You must start mongodb server, redis server first. Change the username and password uri in the .env file above.

<details>
<summary><b>Create a .env File or Run `python generate_env.py`</b></summary>
<p>

```text
# mongodb connection
mongodb_server=localhost
mongodb_port=27017
mongodb_username=bringthemhome
mongodb_password=bringthemhome

# fastapi
fastapi_ui_username=bringthemhome
fastapi_ui_password=bringthemhome
jwt_secret_key=bringthemhome
static_bearer_secret_key=bringthemhome
algorithm=HS256

# chatgpt
open_ai_organization=org-your_openai_key
open_ai_secret_key=sk-your_openai_key

# default root user
owner_username=root
owner_password=bringthemhome
owner_email=israel@israeli.com

# Initial email settings located in app/components/initial settings.py
```

Please note: mongodb uri should be "localhost" if you running it locally, or "mongodb" if you running it inside a docker
container
</p>
</details>

* Update PIP && Install requirements.txt
    ```shell
    python.exe -m pip install --upgrade pip
    ```
    ```shell
     pip install -r requirements.txt
    ```

* Start FastAPI server with Uvicorn

    ```shell
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```

### If you want to frontend (Next.js)
You need to have Node.js installed on your machine.
Visit https://nodejs.org/ to download and install the latest version.

<details>
<summary><b>Create a .env File If Necessary; Otherwise, Default Settings Are Loaded</b></summary>
<p>

```text
# Set the URL for your backend here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# The default value is 'bringthemhome'. Ensure this matches the 'static_bearer_secret_key' set in your backend.
NEXT_PUBLIC_API_KEY=static_bearer_secret_key
```

Please note: If you are running MongoDB locally, the URI should be set to "localhost". If you are running MongoDB inside a Docker container, the URI should be set to "mongodb".
container
</p>
</details>

* <b>For Development:</b>

    ```shell
    npm install
    ```
    ```shell
     npm run dev
    ```

* <b>For Production:</b>
    ```shell
    npm run build
    ```
  ```shell
    npm start
    ```

## Usage

- Frontend: [http://localhost:3000](http://localhost:3000)
  ```swagger codegen
  Username: root
  Password: bringthemhome
  ```
* Access the API documentation at http://localhost:8000/docs. You can obtain a token by entering your username and password from the text box above. 
* Please note that the Swagger UI is also password-protected, and it will temporarily block access if the password is entered incorrectly more than five times, for a duration of five minutes.
  ```swagger codegen
  Username: bringthemhome
  Password: bringthemhome
  ```


## Security Practices
This application implements advanced security practices including password hashing, token validation, rate limiting, and secure API documentation access.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Credits
- Developed by George Khananaev.
- Thanks to the FastAPI, MongoDB, Redis, and Docker communities for support and resources.

## Additional Requests

If you have ideas on how we can grow it into something greater, please share your suggestions. Additionally, if you have any special requests or unique features you'd like to see implemented, feel free to include those as well.

## Support Me

If you find my work helpful, consider supporting me by buying me a coffee at [Buy Me A Coffee](https://www.buymeacoffee.com/georgekhananaev).

Your support helps me continue to create and maintain useful projects. 

Thank you!


[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/georgekhananaev)


**Learn Python Today.**
_"Why python? In just a few days, I was able to develop an advanced system; imagine the vast expanse of innovation we could unlock with several months at our disposal. The only limit to what we can achieve lies in the breadth of our imagination." - George Khananaev_
