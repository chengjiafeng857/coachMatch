#!/bin/bash

# Create database
createdb mirror_match_coaching

# Run schema creation
psql -d mirror_match_coaching -f 00_init.sql

# Run mock data insertion
psql -d mirror_match_coaching -f mock_data.sql

echo "Database setup complete!" 