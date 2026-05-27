#!/bin/bash
set -e
if psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='sonarqube'" | grep -q 1; then
  echo "Database sonarqube already exists"
else
  echo "Creating database sonarqube"
  psql -U "$POSTGRES_USER" -c "CREATE DATABASE sonarqube"
fi
