# Trading Platform

A full-stack financial trading platform with real-time market data, portfolio management, and role-based access control.

## Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Backend Documentation](#backend-documentation)
  - [Prerequisites](#backend-prerequisites)
  - [Configuration](#backend-configuration)
  - [Running the Backend](#running-the-backend)
  - [Docker (Backend)](#docker-backend)
  - [API Documentation](#api-documentation)
  - [Database Entities](#database-entities)
  - [Security](#security)
- [Frontend Documentation](#frontend-documentation)
  - [Prerequisites](#frontend-prerequisites)
  - [Configuration](#frontend-configuration)
  - [Running the Frontend](#running-the-frontend)
  - [Docker (Frontend)](#docker-frontend)
  - [Pages & Features](#pages--features)
  - [Authentication & Authorization](#authentication--authorization)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Architecture

The application follows a **client-server architecture** with a clear separation of concerns:

- **Backend**: Spring Boot REST API serving JSON over HTTP
- **Frontend**: React Single Page Application (SPA)
- **Database**: PostgreSQL for persistent data storage
- **Authentication**: JWT (JSON Web Token) based stateless authentication
- **API Documentation**: OpenAPI 3 / Swagger UI

---

## Technology Stack

### Backend

| Component | Technology |
|-----------|-----------|
| Framework | Spring Boot 4.1.0 |
| Language | Java 17 |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT (JJWT 0.12.6) |
| API Docs | Springdoc OpenAPI 2.8.6 |
| Build Tool | Maven |
| Codegen | Lombok |

### Frontend

| Component | Technology |
|-----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Router | React Router 7 |
| UI Library | MUI 7 (Material-UI) |
| HTTP Client | Axios |
| Charts | Recharts |
| Notifications | Notistack |

---

## Project Structure

```
FTP/v1/
├── backend/
│   ├── src/main/java/com/ftp/backend/
│   │   ├── BackendApplication.java
│   │   ├── config/
│   │   │   ├── CorsConfig.java
│   │   │   ├── OpenApiConfig.java
│   │   │   ├── RoleInitializer.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── MarketDataController.java
│   │   │   ├── PortfolioController.java
│   │   │   ├── TradingController.java
│   │   │   ├── TransactionController.java
│   │   │   ├── UserController.java
│   │   │   ├── WalletController.java
│   │   │   └── WatchlistController.java
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   ├── ERole.java
│   │   │   ├── MarketData.java
│   │   │   ├── Order.java
│   │   │   ├── OrderType.java
│   │   │   ├── OrderStatus.java
│   │   │   ├── Portfolio.java
│   │   │   ├── Wallet.java
│   │   │   ├── Transaction.java
│   │   │   ├── TransactionType.java
│   │   │   ├── Watchlist.java
│   │   │   └── WatchlistItem.java
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── model/
│   │   │   ├── OrderType.java
│   │   │   ├── OrderStatus.java
│   │   │   └── TransactionType.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── RoleRepository.java
│   │   │   ├── MarketDataRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   ├── PortfolioRepository.java
│   │   │   ├── WalletRepository.java
│   │   │   ├── TransactionRepository.java
│   │   │   ├── WatchlistRepository.java
│   │   │   └── WatchlistItemRepository.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   ├── JwtAuthEntryPoint.java
│   │   │   ├── JwtAccessDeniedHandler.java
│   │   │   └── CurrentUserUtils.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── TradingService.java
│   │       ├── WatchlistService.java
│   │       ├── MarketDataService.java
│   │       ├── PortfolioService.java
│   │       ├── WalletService.java
│   │       ├── UserService.java
│   │       ├── DashboardStatsService.java
│   │       ├── TransactionService.java
│   │           └── impl/
│   │           │   └── [Service Implementations]
│   ├── src/main/resources/application.properties
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── market.js
│   │   │   ├── trading.js
│   │   │   ├── portfolio.js
│   │   │   ├── wallet.js
│   │   │   ├── user.js
│   │   │   ├── transactions.js
│   │   │   └── watchlist.js
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── PortfolioChart.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Market.jsx
│   │   │   ├── Trade.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Watchlist.jsx
│   │   │   ├── Wallet.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── index.html
├── backend/pom.xml
└── frontend/package.json
```

---

## Backend Documentation

### Backend Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **PostgreSQL 12+** running on `localhost:5432`
- Database named `trading_platform`

### Backend Configuration

Configurable via `backend/src/main/resources/application.properties`:

```properties
spring.application.name=trading-platform
server.port=8080

# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/trading_platform
spring.datasource.username=postgres
spring.datasource.password=mysecretpassword
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# Logging
logging.level.org.springframework.security=DEBUG
logging.level.com.ftp.backend=DEBUG
```

### Running the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or build and run the JAR:

```bash
cd backend
./mvnw clean package
java -jar target/trading-platform-0.0.1-SNAPSHOT.jar
```

The API will be available at `http://localhost:8080/api`.

### Docker (Backend)

Multi-stage Dockerfile located at `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-slim
WORKDIR /app
COPY --from=builder /app/target/trading-platform-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build the backend image:
```bash
docker build -t trading-platform-backend ./backend
```

Run the backend container:
```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/trading_platform \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=mysecretpassword \
  trading-platform-backend
```

### API Documentation

OpenAPI (Swagger) UI is available at:  
`http://localhost:8080/swagger-ui.html`

### Backend Controllers & Endpoints

#### AuthController (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate and get JWT token | Public |

#### TradingController (`/api/trading`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/orders` | Place a new BUY or SELL order | Authenticated |
| DELETE | `/orders/{orderId}` | Cancel own pending order | Authenticated |
| GET | `/orders` | Get current user's orders | Authenticated |
| GET | `/orders/{orderId}` | Get specific order by ID | Authenticated |
| GET | `/admin/orders` | Get ALL orders in system | Admin only |
| GET | `/admin/orders/user/{userId}` | Get orders for specific user | Admin only |
| DELETE | `/admin/orders/{orderId}/force` | Force cancel any order | Admin only |

#### MarketDataController (`/api/market`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/data/{symbol}` | Get market data by symbol | Public |
| GET | `/data` | Get all market data | Public |
| GET | `/search?query=` | Search market data by symbol/company | Public |
| POST | `/data` | Create new market data entry | Admin only |
| PUT | `/data/{symbol}` | Update existing market data | Admin only |
| DELETE | `/data/{symbol}` | Delete market data entry | Admin only |

#### PortfolioController (`/api/portfolio`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get current user's portfolio | Authenticated |
| GET | `/summary` | Get current user's portfolio summary | Authenticated |
| GET | `/admin/portfolios` | Get all portfolios | Admin only |
| GET | `/admin/portfolios/user/{userId}` | Get portfolio by user ID | Admin only |
| GET | `/admin/portfolios/summary/user/{userId}` | Get portfolio summary by user ID | Admin only |

#### WatchlistController (`/api/watchlist`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create a new watchlist | Authenticated |
| GET | `/` | Get current user's watchlists | Authenticated |
| POST | `/{watchlistId}/items?sym=&companyName=` | Add symbol to watchlist | Authenticated |
| DELETE | `/{watchlistId}/items/{symbol}` | Remove symbol from watchlist | Authenticated |
| DELETE | `/{watchlistId}` | Delete entire watchlist | Authenticated |
| GET | `/admin/watchlists` | Get all watchlists | Admin only |
| GET | `/admin/watchlists/user/{userId}` | Get watchlists by user ID | Admin only |

#### WalletController (`/api/wallet`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/balance?userId=` | Get wallet balance (self or specified user) | Authenticated / Admin |
| POST | `/deposit?userId=` | Deposit funds to wallet | Admin only |
| POST | `/withdraw?userId=` | Withdraw funds from wallet | Admin only |

#### UserController (`/api/users`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get current user's profile | Authenticated |
| PUT | `/profile` | Update current user's profile | Authenticated |
| GET | `/stats` | Get admin dashboard statistics | Admin only |
| GET | `/{userId}` | Get user by ID | Admin only |
| GET | `/` | Get all users | Admin only |
| DELETE | `/{userId}` | Delete user by ID | Admin only |

#### TransactionController (`/api/transactions`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/history?userId=` | Get transaction history (self or specified user) | Authenticated / Admin |
| GET | `/{transactionId}` | Get transaction by ID | Authenticated |

### Database Entities

#### Core Entities

| Entity | Description | Key Fields |
|--------|-------------|------------|
| **User** | Application user | id, username, email, password, firstName, lastName, enabled, roles, timestamps |
| **Role** | User role (USER, ADMIN) | id, name (ERole enum) |
| **MarketData** | Stock/market symbol data | id, symbol, companyName, currentPrice, openPrice, highPrice, lowPrice, previousClose, volume, change, changePercent, lastUpdated |
| **Order** | Trading order | id, user, orderType, orderStatus, symbol, quantity, price, totalAmount, filledQuantity, filledPrice, fee, timestamps |
| **Portfolio** | User's held assets | id, user, symbol, quantity, avgBuyPrice, currentValue, profitLoss, profitLossPercent, timestamps |
| **Wallet** | User's funds | id, userId, balance, availableBalance, currency, timestamps |
| **Transaction** | Financial transaction record | id, user, type, amount, symbol, quantity, price, fee, description, timestamps |
| **Watchlist** | User's watchlist collection | id, user, name |
| **WatchlistItem** | Individual item in a watchlist | id, watchlist, symbol, companyName |

### Security

- **Spring Security** with stateless JWT authentication
- **Role-based access control**:
  - `ROLE_USER`: Standard authenticated users with access to trading, portfolio, wallet, etc.
  - `ROLE_ADMIN`: Administrators with full system access, including user management and system-wide reporting
- **Password encoding**: BCrypt (via Spring Security)
- **JWT secret and expiration**: Configured in `application.properties`
- **CORS**: Configured for frontend-backend communication
- **Protected endpoints**: All `/api/**` endpoints except auth and public market data endpoints require authentication

---

## Frontend Documentation

### Frontend Prerequisites

- **Node.js 18+**
- **npm** or **yarn**

### Frontend Configuration

The frontend dev server runs on **port 3000** and proxies `/api` requests to the backend at `http://localhost:8080`.

`vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

Build for production:
```bash
npm run build
```

### Docker (Frontend)

Multi-stage Dockerfile located at `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Nginx configuration at `frontend/nginx.conf`:
- Serves the React SPA with SPA routing support (`try_files`)
- Proxies `/api` requests to the backend at `http://localhost:8080`

Build the frontend image:
```bash
docker build -t trading-platform-frontend ./frontend
```

Run the frontend container:
```bash
docker run -p 80:80 \
  -e VITE_API_URL=http://localhost:8080/api \
  trading-platform-frontend
```

### Pages & Features

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | User authentication with username/email and password |
| `/register` | Register | New user registration form |
| `/dashboard` | Dashboard | Overview with portfolio stats, market overview, and recent orders |
| `/market` | Market | Browse/search market data, view stock information |
| `/trade` | Trade | Place BUY/SELL orders, view order history |
| `/portfolio` | Portfolio | View holdings, profit/loss, and portfolio distribution |
| `/watchlist` | Watchlist | Manage personal watchlists and tracked symbols |
| `/wallet` | Wallet | View balance and transaction history |
| `/history` | History | View all transaction history |
| `/users` | Users | (Admin only) Manage users, view admin dashboard stats |

### Authentication & Authorization

- **AuthContext** (`/src/context/AuthContext.jsx`): Global state management for user authentication
- **JWT Token**: Stored in `localStorage` as `token`
- **User Data**: Stored in `localStorage` as `user`
- **Axios Interceptor**: Automatically attaches JWT to API requests and redirects to `/login` on 401

#### Route Protection

- **ProtectedRoute**: Wraps routes that require authentication
- **AdminRoute**: Wraps routes that require `ROLE_ADMIN`

---

## Getting Started

### 1. Set up the Database
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE trading_platform;
```

### 2. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
The backend starts on `http://localhost:8080`.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:3000`.

### 4. Access the Application
- Open `http://localhost:3000` in your browser
- Register a new user or use an existing account
- Access Swagger UI at `http://localhost:8080/swagger-ui.html`

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `jwt.secret` | JWT signing secret | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `jwt.expiration` | JWT token expiration in milliseconds | `86400000` (24 hours) |
| `spring.datasource.url` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/trading_platform` |
| `spring.datasource.username` | Database username | `postgres` |
| `spring.datasource.password` | Database password | `mysecretpassword` |
