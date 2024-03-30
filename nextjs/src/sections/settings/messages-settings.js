'use client'
import React from 'react';
import {Box, Card, CardContent, Grid, Stack, TextField, Typography} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from "react-query";
import toast from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Loading from "@/components/loading";
import ConfirmModal from "@/components/confirmation-modal";
import {useAuth} from "@/api/auth/auth-context";
import {apiClient, fetchMessageSettings, updateMessageSettings} from "@/api/endpoints";
import WarpEffect from "@/components/warp-effects";
import {jsonHeader} from "@/api/headers";

export const MessagesSettings = () => {
    const queryClient = useQueryClient();
    const {accessToken} = useAuth();
    const {data: settings, isLoading, error} = useQuery('settings', () => fetchMessageSettings(accessToken), {
        onError: (error) => {
            toast.error(`Fetching settings failed: ${error.message}`);
        },
        refetchOnWindowFocus: false
    });

    const updateMutation = useMutation(({section, settings}) => updateMessageSettings({
        section,
        settings,
        accessToken
    }), {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('settings').then();
            toast.success('Settings updated successfully');
        },
        onError: (error) => {
            toast.error(`Updating settings failed: ${error.message}`);
        },
    });

    const handleChange = (section, key) => (event) => {
        const updatedSectionSettings = {
            ...settings[section],
            [key]: event.target.value,
        };

        // Optimistically update the settings
        queryClient.setQueryData('settings', {
            ...settings,
            [section]: updatedSectionSettings,
        });
    };

    const handleSubmit = (section) => async () => {
        if (updateMutation.isLoading) return; // Prevent double submission

        try {
            // First, update the settings
            await updateMutation.mutateAsync({section, settings: settings[section]});

            // If the section is SMTP, initiate testing configurations toast
            if (section === 'smtp') {
                // Show a loading toast with an initial message
                // Test email will be sent to default system email, check the backend "test-email" router for more details.
                const toastId = toast.loading('Testing configurations...');

                try {
                    const testEmailResponse = await apiClient.post('/test-email/', {
                        // Include relevant data if needed
                    }, {headers: jsonHeader(accessToken)});

                    if (testEmailResponse.status === 200) {
                        // Update the toast to a success message
                        toast.success('Test email sent successfully', {id: toastId});
                    } else {
                        // Update the toast to show failure message
                        toast.error('Failed to send test email', {id: toastId});
                    }
                } catch (error) {
                    // In case of an exception, update the toast to show an error message
                    toast.error(`Test email failed: ${error.message}`, {id: toastId});
                }
            }

            // Manually refetch the settings data to refresh UI
            await handleRefresh()

        } catch (error) {
            toast.error(`Operation failed: ${error.message}`);
        }
    };

    const handleRefresh = async () => {
        try {
            // Invalidate and refetch the settings query to refresh the data
            await queryClient.invalidateQueries('settings');
            await queryClient.refetchQueries('settings', {active: true});

        } catch (error) {
            // In case of an error during refresh, update the toast to show an error message
            toast.error(`Failed to refresh configurations: ${error.message}`);
        }
    };


    // Define the fields for each settings section
    const fields = {
        smtp: [
            {label: "SMTP Server", key: "server"},
            {label: "SMTP Port", key: "port"},
            {label: "SMTP User", key: "user"},
            {label: "SMTP Password", key: "password", type: "password"},
            {label: "Default System Email", key: "system_email"},
        ],
        whatsapp: [
            {label: "Account SID", key: "account_sid"},
            {label: "Auth Token", key: "auth_token"},
            {label: "From Number", key: "from_number"},
        ],
        sms: [
            {label: "SMS Provider", key: "provider"},
            {label: "API Key", key: "api_key"},
            {label: "From Number", key: "from_number"},
        ],
    };

    if (isLoading) return <Loading/>;
    if (error) return <WarpEffect effect="fadeInDown">An error occurred: {error.message}</WarpEffect>;

    return (
        <Stack spacing={4}
               sx={{mb: 5}}>

            {/*refresh button*/}
            {/*<div style={{display: 'flex', justifyContent: 'flex-end'}}>*/}
            {/*    <RefreshIconButton onRefresh={handleRefresh}/>*/}
            {/*</div>*/}


            {/* SMTP Settings */}
            <Card>
                <CardContent>
                    <Typography variant="h5"
                                sx={{mb: 3}}
                                gutterBottom>SMTP Settings</Typography>
                    <Grid container
                          spacing={2}
                          component="form"
                          onSubmit={handleSubmit('smtp')}>
                        {fields?.smtp.map((field) => (
                            <Grid item
                                  xs={12}
                                  sm={6}
                                  key={field.key}>
                                <TextField
                                    label={field.label}
                                    variant="outlined"
                                    fullWidth
                                    type={field.type || "text"}
                                    value={settings?.smtp?.[field.key]}
                                    onChange={handleChange('smtp', field.key)}
                                />
                            </Grid>
                        ))}
                        <Grid item
                              xs={12}>
                            <Tooltip title={settings?.smtp?.active ? "Active" : "Inactive"}>
                                <IconButton>
                                    {settings?.smtp?.active ? (
                                        <CheckCircleOutlineIcon style={{color: 'green'}}/>
                                    ) : (
                                        <HighlightOffIcon style={{color: 'red'}}/>
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center'}}>
                                <ConfirmModal
                                    onConfirm={handleSubmit('smtp')} // Ensure handleSubmit is defined or passed as a prop
                                    buttonName="Save SMTP Settings"
                                    confirmationText="Are you sure you want to save these SMTP settings?"
                                    title="Confirm Save"
                                    margin={2}
                                    color="primary"
                                />
                                {/*{settings?.smtp?.active && (<EmailModal ButtonName={"Send System Email"}/>)}*/}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* WhatsApp Settings */}
            <Card>
                <CardContent>
                    <Typography variant="h5"
                                sx={{mb: 3}}
                                gutterBottom>WhatsApp Settings</Typography>
                    <Grid container
                          spacing={2}
                          component="form"
                          onSubmit={handleSubmit('whatsapp')}>
                        {fields?.whatsapp?.map((field) => (
                            <Grid item
                                  xs={12}
                                  sm={6}
                                  key={field.key}>
                                <TextField
                                    label={field.label}
                                    variant="outlined"
                                    fullWidth
                                    value={settings?.whatsapp[field.key]}
                                    onChange={handleChange('whatsapp', field.key)}
                                />

                            </Grid>
                        ))}
                        <Grid item
                              xs={12}>
                            <Tooltip title={settings?.whatsapp?.active ? "Active" : "Inactive"}>
                                <IconButton>
                                    {settings?.whatsapp?.active ? (
                                        <CheckCircleOutlineIcon style={{color: 'green'}}/>
                                    ) : (
                                        <HighlightOffIcon style={{color: 'red'}}/>
                                    )}
                                </IconButton>
                            </Tooltip>
                            <ConfirmModal
                                onConfirm={handleSubmit('whatsapp')}
                                buttonName="Save WhatsApp Settings"
                                confirmationText="Are you sure you want to save these WhatsApp settings?"
                                title="Confirm Save"
                                margin={2}
                                color="primary"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* SMS Settings */}
            <Card>
                <CardContent>
                    <Typography variant="h5"
                                sx={{mb: 3}}
                                gutterBottom>SMS Settings</Typography>
                    <Grid container
                          spacing={2}
                          component="form"
                          onSubmit={handleSubmit('sms')}>
                        {fields?.sms.map((field) => (
                            <Grid item
                                  xs={12}
                                  sm={6}
                                  key={field.key}>
                                <TextField
                                    label={field.label}
                                    variant="outlined"
                                    fullWidth
                                    value={settings?.sms[field.key]}
                                    onChange={handleChange('sms', field.key)}
                                />
                            </Grid>
                        ))}
                        <Grid item
                              xs={12}>
                            <Tooltip title={settings?.sms?.active ? "Active" : "Inactive"}>
                                <IconButton>
                                    {settings?.sms?.active ? (
                                        <CheckCircleOutlineIcon style={{color: 'green'}}/>
                                    ) : (
                                        <HighlightOffIcon style={{color: 'red'}}/>
                                    )}
                                </IconButton>
                            </Tooltip>
                            <ConfirmModal
                                onConfirm={handleSubmit('sms')}
                                buttonName="Save SMS Settings"
                                confirmationText="Are you sure you want to save these SMS settings?"
                                title="Confirm Save"
                                margin={2}
                                color="primary"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    );
};
