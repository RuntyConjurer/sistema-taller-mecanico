#!/usr/bin/env sh
set -eu

run_sql_directory() {
    directory="$1"
    label="$2"

    echo "Inicializando ${label}..."
    find "$directory" -maxdepth 1 -type f -name '*.sql' | sort | while IFS= read -r file; do
        echo "Aplicando ${file}"
        psql \
            --set ON_ERROR_STOP=1 \
            --username "$POSTGRES_USER" \
            --dbname "$POSTGRES_DB" \
            --file "$file"
    done
}

run_sql_directory /database/migrations migraciones
run_sql_directory /database/views vistas
run_sql_directory /database/seeds datos-iniciales
