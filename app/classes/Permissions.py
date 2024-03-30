# permissions.py

class RolePermissions:
    role_permissions_map = {
        "owner": ["read", "write", "delete", "edit"],
        "admin": ["read", "write", "edit"],
        "user": ["read"]
    }


class HTTPMethodPermissions:
    method_permission_map = {
        "GET": "read",
        "POST": "write",
        "PUT": "edit",
        "DELETE": "delete",
    }

    @staticmethod
    def get_permission_for_method(method: str) -> str:
        """Retrieve the permission required for a given HTTP method."""
        return HTTPMethodPermissions.method_permission_map.get(method, "")
