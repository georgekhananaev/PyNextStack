import React from "react";
import useAuthenticatedRoute from "@/hooks/use-authenticated-route";
import {Typography} from "@mui/material";
import UserTable from "@/sections/users/users-table";

function Users() {
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom>
                Users
            </Typography>
            <UserTable/>
        </>
    );
}

export default useAuthenticatedRoute(Users);
