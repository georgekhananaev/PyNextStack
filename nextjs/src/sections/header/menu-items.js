// menuItems.js
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExtensionIcon from '@mui/icons-material/Extension';
import React from "react";
import {ChatGptIcon} from "@/theme/menu-icons";

const iconStyle = {height: 16, width: 16, mb: "-3px", mr: 0.5};

export const menuItems = [
    {
        icon: <GitHubIcon sx={iconStyle}/>,
        label: "README",
        tooltip: "README.md Documentations",
        path: "/",
        authenticated: null
    },
    {
        icon: <LoginIcon sx={iconStyle}/>,
        label: "Login",
        tooltip: "Login Page",
        path: "/login",
        authenticated: false
    },
    {
        icon: <DashboardIcon sx={iconStyle}/>,
        label: "Dashboard",
        tooltip: "Dashboard Page",
        path: "/dashboard",
        authenticated: true
    },
    {
        icon: <PeopleAltIcon sx={iconStyle}/>,
        label: "Users",
        tooltip: "Users",
        path: "/users",
        authenticated: true
    },
    {
        icon: <ExtensionIcon sx={iconStyle}/>,
        label: "Extensions",
        tooltip: "Feature List",
        authenticated: true,
        subItems: [
            {
                icon: <ChatGptIcon width={20} height={20}/>,
                label: "ChatGPT",
                path: "/extensions/chatgpt",
                authenticated: true
            }
        ]
    },
];
