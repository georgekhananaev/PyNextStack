import {useState} from 'react';
import {useQuery} from 'react-query';
import {Avatar, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BlockIcon from '@mui/icons-material/Block';
import {amber, blue, deepPurple, green, pink, red} from '@mui/material/colors';
import Loading from "@/components/loading";
import {getProfile} from "@/api/endpoints";
import {useAuth} from "@/api/auth/auth-context";

function UserProfile() {
    const {accessToken} = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    const {data: user, isLoading, isError} = useQuery(
        'userProfile',
        () => getProfile(accessToken),
        {
            enabled: !!accessToken, // Only run query if token exists
        }
    );

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleSave = () => {
        console.log('Saving data', editedUser);
        setEditMode(false);
        // Typically, here you would send a PUT request to save the updated user data
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setEditedUser({...editedUser, [name]: value});
    };

    if (isLoading || !user) return <Loading/>;
    if (isError) return <div>Error loading user profile.</div>;

    // noinspection JSUnresolvedReference
    return (
        <Card sx={{m: 2, borderRadius: '16px', boxShadow: 3}}>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: deepPurple[500]}} aria-label="profile">
                        {user.full_name[0].toUpperCase()}
                    </Avatar>
                }
                title={<Typography variant="h6">{editMode ? "Edit Profile" : "Profile"}</Typography>}
                action={
                    editMode ? (
                        <IconButton aria-label="save" onClick={handleSave}>
                            <SaveIcon sx={{color: green[500]}}/>
                        </IconButton>
                    ) : (
                        <IconButton aria-label="edit" onClick={handleEditToggle}>
                            <EditIcon sx={{color: blue[500]}}/>
                        </IconButton>
                    )
                }
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <BadgeIcon sx={{color: pink[500], mr: 1}}/>
                        <Typography variant="body2">ID: {user._id}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        {user.disabled ? (
                            <BlockIcon sx={{color: red[500], mr: 1}}/>
                        ) : (
                            <VerifiedUserIcon sx={{color: blue[500], mr: 1}}/>
                        )}
                        <Typography variant="body2">Status: {user.disabled ? 'Disabled' : 'Active'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <AccountCircleIcon sx={{color: blue[500], mr: 1}}/>
                        {editMode ? (
                            <TextField fullWidth label="Full Name" variant="outlined" defaultValue={user.full_name}
                                       name="full_name" onChange={handleChange}/>
                        ) : (
                            <Typography variant="body2">Full Name: {user.full_name}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <AccountCircleIcon sx={{color: deepPurple[500], mr: 1}}/>
                        <Typography variant="body2">Username: {user.username}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <EmailIcon sx={{color: green[500], mr: 1}}/>
                        {editMode ? (
                            <TextField fullWidth label="Email" variant="outlined" defaultValue={user.email} name="email"
                                       onChange={handleChange}/>
                        ) : (
                            <Typography variant="body2">Email: {user.email}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <AdminPanelSettingsIcon sx={{color: amber[700], mr: 1}}/>
                        <Typography variant="body2">Role: {user.role}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default UserProfile;
