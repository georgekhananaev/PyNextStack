export const jsonHeader = (token) => ({
    'Accept': 'application/json',
    ...(token ? {'api-key': token} : {}),
});

export const staticBearerHeader = {
    'accept': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
};