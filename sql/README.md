# MirrorMatchCoaching Database Setup

This directory contains the database schema and mock data for the MirrorMatchCoaching application.

## Prerequisites

1. PostgreSQL installed and running
2. pgmodeler installed (for UML diagram generation)

## Setup Instructions

1. Start PostgreSQL service:
```bash
# On macOS
brew services start postgresql

# On Linux
sudo service postgresql start
```

2. Create and populate the database:
```bash
./setup_database.sh
```

3. Generate UML diagram:
```bash
./generate_uml.sh
```

## Database Structure

The database consists of the following tables:
- users
- coaches
- clients
- feedback
- practice_sessions
- check_ins
- goals
- notifications
- sessions

## Mock Data

The `mock_data.sql` file contains sample data for demonstration purposes:
- 2 coaches
- 3 clients
- 5 feedback entries
- 5 practice sessions
- 5 check-ins
- 5 goals
- 5 notifications
- 5 sessions

## Viewing the UML Diagram

The generated UML diagram can be viewed using:
1. PlantUML Online Server: http://www.plantuml.com/plantuml/uml/
2. VS Code with PlantUML extension
3. Any PlantUML-compatible viewer

## Database Connection

To connect to the database:
```bash
psql -d mirror_match_coaching
```

## Useful Commands

List all tables:
```sql
\dt
```

Describe a table:
```sql
\d+ table_name
```

View table contents:
```sql
SELECT * FROM table_name LIMIT 5;
``` 