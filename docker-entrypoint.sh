#!/bin/bash

# Replace environment variables in the built JavaScript files
# This allows us to change API endpoints without rebuilding the image

echo "Starting BlogHub Frontend..."

# Replace API base URL in the built files
if [ ! -z "$VITE_API_BASE_URL" ]; then
    echo "Setting API base URL to: $VITE_API_BASE_URL"
    find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:3000|$VITE_API_BASE_URL|g" {} \;
fi

# Replace app name if provided
if [ ! -z "$VITE_APP_NAME" ]; then
    echo "Setting app name to: $VITE_APP_NAME"
    find /usr/share/nginx/html -name "*.html" -type f -exec sed -i "s|BlogHub|$VITE_APP_NAME|g" {} \;
fi

echo "Environment configuration complete. Starting Nginx..."

# Execute the main command
exec "$@" 