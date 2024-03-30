import React, {useState} from 'react';
import {useAuth} from "@/api/auth/auth-context"; // Ensure correct path
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import ConfirmModal from "@/components/confirmation-modal";
import {logout as apiLogout} from "@/api/endpoints";
// import LogoutIcon from '@mui/icons-material/Logout'; // Import the Logout icon

export default function LogoutButton() {
    const {accessToken, setAccessToken, setIsAuthenticated} = useAuth(); // Correctly destructure needed functions
    const router = useRouter();
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

    const handleLogout = async () => {
        try {
            await apiLogout(accessToken); // Assume this is your API call to invalidate the session on the server
            setAccessToken(''); // Clear the access token in the context
            setIsAuthenticated(false); // Update isAuthenticated state
            toast.success('Logout successful!');
            await router.push('/'); // Redirect to the homepage or login page
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('An error occurred during logout.');
        }
    };

    return (
        <ConfirmModal
            open={showCancelConfirmation}
            onClose={() => setShowCancelConfirmation(false)}
            onConfirm={handleLogout}
            buttonName="Logout"
            buttonSize="small"
            // icon={<LogoutIcon/>}
            buttonVariant={"outlined"}
            confirmButtonName="Logout"
            title="You are about to logout"
            confirmationText="Please confirm you want to logout"
            color="error"
        />
    );
}
