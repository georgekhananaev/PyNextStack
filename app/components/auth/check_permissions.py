from fastapi import Depends, HTTPException, Request
from starlette.status import HTTP_403_FORBIDDEN, HTTP_401_UNAUTHORIZED

from app.classes.Permissions import RolePermissions, HTTPMethodPermissions
from app.components.auth.jwt_token_handler import get_jwt_username
from app.components.logger import logger
from app.db.mongoClient import async_database


async def check_permissions(request: Request, username: str = Depends(get_jwt_username)):
    """
    Check if the user has the required permissions to access the route.
    """
    try:
        user_collection = async_database.users
        user = await user_collection.find_one({"username": username})
        if not user:
            logger.error(f"User not found: {username}")
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="User not found.")

        if user.get("disabled", False):
            logger.warning(f"Access denied for disabled account: {username}")
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Account is disabled.")

        user_role = user.get("role")

        # Use the new classes for permission checking
        required_permission = HTTPMethodPermissions.get_permission_for_method(request.method)

        # Check if the user's role includes the required permission
        user_permissions = RolePermissions.role_permissions_map.get(user_role, [])
        if required_permission not in user_permissions:
            logger.warning(f"Permission denied: {username} attempted to {request.method}")
            raise HTTPException(status_code=HTTP_403_FORBIDDEN,
                                detail="You don't have permission to perform this action.")
        logger.info(f"Permission granted: {username} accessed {request.url.path} with method {request.method}")
    except HTTPException as e:
        # Log the error and re-raise the exception
        logger.error(f"Error during permission check for user {username}: {str(e.detail)}")
        raise
