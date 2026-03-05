# Books Library

Webowa aplikacja do śledzenia przeczytanych książek.

## Stack

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite
- **Baza danych:** PostgreSQL
- **Konteneryzacja:** Docker + Docker Compose

## Uruchomienie

### Wymagania

- Docker
- Docker Compose

### Konfiguracja

```bash
cp .env.example .env
```

Uzupełnij zmienne w pliku `.env`.

### Start

```bash
docker compose up --build
```

Aplikacja dostępna pod adresem:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

### Zatrzymanie

```bash
docker compose down
```

## Struktura projektu

```
bookslibrary/
├── backend/        # Django REST API
├── frontend/       # React + Vite
├── docker-compose.yml
├── .env.example
└── README.md
```
