from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


# Define roles
class Role(str, Enum):
    owner = "owner"
    admin = "admin"
    user = "user"


class UserBase(BaseModel):
    username: str  # User's username
    email: EmailStr  # User's email, validated to be a proper email format
    full_name: str  # User's full name
    disabled: Optional[bool] = None  # Optional field to disable the user
    role: Role = Role.user  # Default role

class UpdateUser(BaseModel):
    username: Optional[str] = None  # Now optional
    email: Optional[EmailStr] = None  # Now optional, but still validated if provided
    full_name: Optional[str] = None  # Now optional
    disabled: Optional[bool] = None  # Remains optional
    role: Optional[Role] = Role.user  # Optional, with a default value if not provided
    password: Optional[str] = None

class UserCreate(UserBase):
    password: Optional[str]  # Password field for user creation


class User(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")  # User ID, mapping MongoDB's '_id'

    @classmethod
    def from_mongo(cls, data: dict):
        if "_id" in data:
            data["_id"] = str(data["_id"])  # Convert MongoDB ObjectId to string
        return cls(**data)  # Create User instance with modified data

    class Config:
        json_schema_extra = {
            "example": {
                "username": "israel",
                "email": "israel@example.com",
                "full_name": "israel israeli",
                "disabled": False,
            }
        }
        from_attributes = True  # Enable ORM mode for compatibility with databases
        populate_by_name = True  # Allows field population by name, useful for fields with aliases


class UserRegistration(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "username": "newuser",
                "email": "newuser@example.com",
                "full_name": "New User",
                "password": "securepassword123",
            }
        }
