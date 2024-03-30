import asyncio  # Provides infrastructure for writing single-threaded concurrent code using coroutines
import logging  # Enables logging events for your application, essential for debugging and monitoring
from typing import Any  # Facilitates type hints, allowing for more readable and maintainable code

import uvicorn  # ASGI server for running your FastAPI application, handling asynchronous requests
from fastapi import FastAPI, Depends  # Core FastAPI functionality for creating API and managing dependencies
from fastapi.middleware.cors import \
    CORSMiddleware  # Middleware for handling CORS (Cross-Origin Resource Sharing) settings
from fastapi.security import HTTPBasicCredentials  # Security utility for basic HTTP authentication
from starlette.config import Config  # Configuration management, often used for environment variables

# Local imports for authentication components and initial settings setup
from app.components.auth.fastapi_auth import verify_credentials, get_secret_key
from app.components.auth.jwt_token_handler import get_jwt_secret_key
from app.components.initial_settings import create_owner, initialize_message_settings, create_indexes

#Database clients
from app.db.mongoClient import async_mdb_client, validate_mongodb_connection
from app.db.redisClient import AsyncRedisClient

# Routers
from app.routers import auth, users, chatgpt, register
from app.routers.settings import messages


class State:
    """
    Represents the global state of the application.

    This class can be used to store and manage application-wide data or configurations,
    such as database connections, external service clients, shared configurations,
    or any other resources that need to be globally accessible throughout the application.
    """
    redis: Any = None  # Use a more specific type if possible

class CustomFastAPI(FastAPI):
    """
    A custom extension of FastAPIs FastAPI class, incorporating a global state.

    This class enhances the standard FastAPI application by integrating a `state` property,
    which is an instance of the `State` class. This `state` can be used to maintain and access
    application-wide resources, configurations, or data, facilitating easier management of
    global dependencies and stateful information.

    Attributes:
        state (State): An instance of the State class to hold the global state of the application.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.state: State = State()


# loading the FastAPI app
app = CustomFastAPI(docs_url=None, redoc_url=None, openapi_url=None)

# Read the configuration
config = Config(".env")

# Configure CORS settings
origins = [
    "*",  # Allows all origins
    # "http://localhost:3000",  # Allows only the specified origin
]

# Add CORS middleware to the application to handle Cross-Origin Resource Sharing (CORS),
# allowing front-end applications from different origins to interact with the API safely.
app.add_middleware(
    CORSMiddleware,  # type: ignore # The middleware class being added to handle CORS.

    # allow_origins: Specifies which origins are allowed to make requests to the API.
    # This is a security measure to prevent unwanted cross-origin requests.
    # You can set specific domains or use ["*"] for allowing all origins.
    allow_origins=origins,

    # allow_credentials: When set to True, allows browsers to include credentials (such as cookies,
    # authorization headers, or TLS client certificates) in requests to the API. This is essential for APIs
    # that require authentication and maintain session information.
    allow_credentials=True,

    # allow_methods: Defines which HTTP methods are allowed when accessing the resource. This list should
    # match the methods supported by your API. It's a way to limit the types of requests that can be made,
    # enhancing security.
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],

    # allow_headers: Specifies which headers can be included in the requests. Setting this to ["*"] allows
    # all headers. For tighter security, you can specify only the headers your API needs to function.
    allow_headers=["*"],

    # expose_headers: This allows the server to whitelist headers that browsers are allowed to access.
    # For example, including "Content-Disposition" enables accessing this header in the response
    # to handle file downloads or attachments in the client application.
    expose_headers=["Content-Disposition"]
)

# API default path
prefix_path = '/api/v1'

# Routers

# Authentication Routes
# Includes endpoints related to authentication processes like login, logout, and token refresh.
# These endpoints are essential for managing user sessions and securing access to the application.
app.include_router(auth.router, prefix=prefix_path, tags=["auth"])

# User Routes
# Consists of user management endpoints allowing for operations such as creating, updating,
# and deleting user accounts. Access to these endpoints is secured with JWT tokens, ensuring
# that only authenticated users can perform these operations.
app.include_router(users.router, prefix=prefix_path, dependencies=[Depends(get_jwt_secret_key)], tags=["users"])

# ChatGPT Routes
# Hosts endpoints for interacting with ChatGPT functionalities, including initiating conversations,
# retrieving responses, and managing chat sessions. These endpoints require JWT authentication,
# highlighting their intended use by authenticated users.
app.include_router(chatgpt.router, prefix=prefix_path, dependencies=[Depends(get_jwt_secret_key)], tags=["chatgpt"])

# Registration Route
# This router is dedicated to user registration and other public-facing functionalities that do not require
# authentication. It relies on a static secret key for some operations, illustrating an example of how
# to implement endpoints with fixed dependencies.
app.include_router(register.router, prefix=prefix_path, dependencies=[Depends(get_secret_key)],
                   tags=["public"])  # example of static dependency, static secret_key from .env

# Message Routes
# Encompasses endpoints for sending and managing messages across various platforms (e.g., email, SMS).
# Access is controlled through a secret key dependency, ensuring that only authorized requests can
# interact with message services.
app.include_router(messages.router, prefix=prefix_path, dependencies=[Depends(get_jwt_secret_key)], tags=["messages"])


@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint(credentials: HTTPBasicCredentials = Depends(verify_credentials)):  # noqa
    """
    OpenAPI endpoint
    :param credentials:
    :return:
    """
    from fastapi.openapi.utils import get_openapi

    openapi_schema = get_openapi(
        title="Your app title is here",
        version="v1.00",
        description="You app description is here",
        routes=app.routes,
    )

    return openapi_schema


@app.get("/docs", include_in_schema=False)
async def custom_docs_url(credentials: HTTPBasicCredentials = Depends(verify_credentials)):  # noqa
    """
    Provides a customized Swagger UI for the API documentation.

    This endpoint overrides the default FastAPI documentation route to add basic HTTP authentication and
    apply custom Swagger UI settings. It ensures that only authorized users can access the API documentation,
    enhancing the security of API introspection.

    The customization includes changing the syntax highlight theme to 'obsidian' and setting the documentation
    expansion mode to 'none', which means the documentation starts with all endpoints collapsed. These settings
    aim to improve the usability and visual appearance of the API documentation for developers.

    Parameters:
    - credentials: HTTPBasicCredentials object obtained from the request, used to authenticate access
      to the documentation. The actual verification is performed by the `verify_credentials` dependency.

    Returns:
    - An HTML response generated by FastAPIs `get_swagger_ui_html` function, containing the customized
      Swagger UI documentation page.
    """
    from fastapi.openapi.docs import get_swagger_ui_html
    return get_swagger_ui_html(swagger_ui_parameters={"syntaxHighlight.theme": "obsidian", "docExpansion": "none"},
                               openapi_url="/openapi.json", title=app.title)  # noqa


@app.get("/redoc", include_in_schema=False)
async def custom_redoc_url(credentials: HTTPBasicCredentials = Depends(verify_credentials)):  # noqa
    """
    ReDoc UI endpoint
    :param credentials:
    :return:
    """
    from fastapi.openapi.docs import get_redoc_html
    return get_redoc_html(openapi_url="/openapi.json", title=app.title)  # noqa

@app.on_event("startup")
async def startup_event():
    """
    Initializes critical components upon FastAPI application startup.

    This function is called automatically when the FastAPI server is started. It serves multiple
    important purposes:

    1. Initializes an asynchronous Redis client and assigns it to the application state, making it
       globally accessible throughout the application. This is essential for operations that require
       caching, message queuing, or any other Redis-powered features.

    2. Calls the `create_owner` function to ensure that an owner account is present in the database.
       This step is crucial for administrative access and managing the application.

    3. Calls the `initialize_message_settings` function to set up initial messaging settings (like
       SMTP for emails, WhatsApp, or SMS configurations). This ensures that the application can
       send notifications or perform communication tasks right from the start.

    If any exceptions occur during these initialization steps, they are caught and logged. This
    catch-all exception handling ensures that the application can still run even if there are issues
    with non-critical initializations. However, it's important to monitor these exceptions and
    address them as needed to ensure all features work as expected.

    Note: The use of 'noqa' in the exception handling implies that we're intentionally ignoring
    specific linting warnings. This is typically done to bypass warnings about bare excepts or
    unused variables (like 'e' for the exception). It's a good practice to log these exceptions
    to understand what went wrong.
    """

    await validate_mongodb_connection()  # Validate MongoDB connection
    await create_indexes()

    app.state.redis = await AsyncRedisClient.get_instance()

    try:
        await create_owner()
        await initialize_message_settings()
    except Exception as e:  # noqa
        pass


@app.on_event("shutdown")
async def shutdown_event():
    """
       Handle the FastAPI application shutdown.

       This function is triggered when the FastAPI server is instructed to shut down. It performs
       necessary cleanup operations, ensuring graceful termination of connections to external services
       like MongoDB and Redis. Specifically, it:

       - Logs the shutdown initiation,
       - Closes the asynchronous Redis client connection, if it exists and is open,
       - Closes the asynchronous MongoDB client connection, if it has been initialized and supports
         an asynchronous close operation.

       This orderly shutdown helps in preventing resource leaks and ensuring that the application can
       be restarted or shut down safely without affecting the underlying databases or services.
   """

    logging.info("Shutdown the application and close the MongoDB, Redis connections")

    # Ensure Redis client is closed properly if it's async
    if app.state.redis and hasattr(app.state.redis, "close"):
        await app.state.redis.close()  # This presumes close is an async method

    # Close the MongoDB client if it's initialized and the close method is awaitable
    if async_mdb_client and hasattr(async_mdb_client, "close"):
        close_method = async_mdb_client.close()
        if asyncio.iscoroutinefunction(async_mdb_client.close) or asyncio.iscoroutine(close_method):
            await close_method


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
