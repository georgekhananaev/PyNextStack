# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
# Don't write byte code files to disk
ENV PYTHONDONTWRITEBYTECODE 1

 # Unbuffered output for easier container logging
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY .. /app


## Copy the entrypoint script into the container
#COPY entrypoint.sh /usr/local/bin/
#
## Make sure the script is executable
#RUN chmod +x /usr/local/bin/entrypoint.sh
#
#ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

## Command to run the application
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


## Run the container with multiple workers instead if needed.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]