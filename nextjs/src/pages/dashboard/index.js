import React from 'react';
import {Box, Button, Grid, Paper, Typography} from '@mui/material';
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import useAuthenticatedRoute from "@/hooks/use-authenticated-route.js";
import {useAuth} from "@/api/auth/auth-context";

const Dashboard = () => {
    const {userProfile} = useAuth();

    const stats = [
        {label: 'Total Projects', value: 12},
        {label: 'Completed Tasks', value: 87},
        {label: 'Open Tickets', value: 5},
    ];

    const data = [
        {name: 'Jan', uv: 400, pv: 2400, amt: 2400},
        {name: 'Feb', uv: 300, pv: 1398, amt: 2210},
        {name: 'Mar', uv: 200, pv: 9800, amt: 2290},
        // Add more months as needed
    ];

    const pieData = [
        {name: 'Group A', value: 400},
        {name: 'Group B', value: 300},
        {name: 'Group C', value: 300},
        {name: 'Group D', value: 200},
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom>
                Welcome back, <Typography variant="h6" component="span"
                                          color={"primary"}> {userProfile?.full_name || 'User'}!</Typography>
            </Typography>
            <Grid container spacing={3} sx={{mt: 2}}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                            sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                {stat.label}
                            </Typography>
                            <Typography component="p" variant="h4">
                                {stat.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}

                {/* Line Chart Section */}
                <Grid item xs={12}>
                    <Paper sx={{p: 2, height: '100%'}}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Monthly Activity
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{r: 8}}/>
                                <Line type="monotone" dataKey="pv" stroke="#82ca9d"/>
                                {/* Add more lines with different colors as needed */}
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Pie Chart Section */}
                <Grid item xs={12}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                                     fill="#8884d8" label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

            </Grid>
            <Box sx={{display: 'flex', justifyContent: 'center', mx: 3, mt: 4, textAlign: 'center'}}>
                <Typography variant="body2" color="warning.main">
                    The information displayed is sample data, serving as an illustration of what this dashboard can
                    offer.
                </Typography>
            </Box>

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <Button variant="contained" color="primary"
                        onClick={() => alert('This could lead to more detailed stats or actions.')}>
                    View More Details
                </Button>
            </Box>
        </>
    );
};

export default useAuthenticatedRoute(Dashboard);