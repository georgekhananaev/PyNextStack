#!/bin/bash

# script.sh

# Replace 'mongodb_server=localhost' with 'mongodb_server=mongodb' in .env
sed -i 's/mongodb_server=localhost/mongodb_server=mongodb/' /app/.env

# Execute the main container command.
exec "$@"
