# balanzify-hr-payroll - Intelligent Testing Platform

A microservices-based IQ testing system with JWT authentication, multi-database support, and third-party integrations.

## Tech Stack

- NestJS | GraphQL | PostgreSQL | Docker | Prisma | Google OAuth | Telegram API

## 🌟 Features

- JWT-based authentication system
- Google OAuth 2.0 integration
- Multi-service database architecture
- GraphQL API endpoints
- Email notification system
- Telegram bot integration
- Containerized deployment
- Automated database migrations

## Quick Start

````bash
git clone https://github.com/imransid/balanzify-hr-payroll.git && cd balanzify-hr-payroll


## 🛠 Tech Stack

- **NestJS** - Backend framework for building efficient and scalable applications.
- **Microservices** - Architecture pattern for decoupling services.
- **PostgreSQL** - Relational database for managing structured data.
- **GraphQL** - API query language for flexible data fetching.
- **Docker** - Containerization for seamless deployment and scalability.

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Clone the Repository

```bash
git clone https://github.com/imransid/balanzify-hr-payroll.git
cd balanzify-hr-payroll
````

### Environment Variables

Create a `.env` file in your project root with the following configurations:

# Auth Configuration

JWT_SECRET='your_jwt_secret'
GOOGLE_CLIENT_ID='your_google_client_id'
GOOGLE_CLIENT_SECRET='your_google_secret'
GOOGLE_CALLBACK_URL='http://localhost:4000/auth/google/callback'

# Database Configuration

USER_DB_URI=postgresql://user:pass@user-db:5432/user-db
NOTICE_DB_URI=postgresql://user:pass@notice-db:5432/notice-db
PAGE_BUILDER_DB_URI=postgresql://user:pass@hr-db:5432/hr-db

# Email Service

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS='your_app_password'

# Telegram Integration

TELEGRAM_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://your-domain.com/telegram/webhook

# File Storage

UPLOAD_DIR=uploads

### Run Services with Docker

Start the application using Docker Compose:

```bash
docker-compose up --build
```

This will spin up the necessary services, including PostgreSQL and microservices.

### Manual Setup (Without Docker)

If you prefer running the services manually:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the PostgreSQL database:
   ```bash
   docker run --name balanzify-hr-payroll-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=balanzify-hr-payroll -p 5432:5432 -d postgres
   ```
3. Run the application:
   ```bash
   npm run start:dev
   ```

## 🔍 API Usage

### GraphQL Playground

Once the server is running, access the GraphQL playground at:

```
http://localhost:4099/graphql
```

## 🛠 Development & Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes and push:
   ```bash
   git push origin feature-branch
   ```
4. Create a Pull Request for review.

docker exec 484d9bfa8ad8 npx prisma generate --schema=./prisma/schema-hr.prisma
docker exec 987a60f42c3f npx prisma migrate deploy --schema=./prisma/schema-hr.prisma
docker exec 223b8d59755b npx prisma generate --schema=./prisma/schema-user.prisma
docker exec fd638e1bb0d6 npx prisma db push --force-reset --schema=./prisma/schema-user.prisma

docker exec c22eaf4afd92 npx prisma generate --schema=./prisma/schema-hr.prisma
docker exec c22eaf4afd92 npx prisma db push --force-reset --schema=./prisma/schema-hr.prisma

sudo docker stop 570112f8996a f4ba3e931603 32384d0a59bc 6e71821497ba 90f54428b1b8
sudo docker rm 570112f8996a f4ba3e931603 32384d0a59bc 6e71821497ba 90f54428b1b8

AAFQEgAAGXTJv4NeP2Wo2YSSQNqPaXh_r0XjlSb_XkXpQg

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## db : HR_DATABASE_URI=HR_DATABASE_URI=postgresql://postgres:rafa_elu2005@145.223.75.199:5432/payroll

test
