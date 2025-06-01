#!/bin/bash

# Generate UML diagram using pgmodeler
pgmodeler-cli --input-db mirror_match_coaching --output-file database_schema.puml --export-format puml

echo "UML diagram generated as database_schema.puml" 