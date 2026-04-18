# 🚀 CampsHub - Quick Start Guide

## Prerequisites
- Java 21 or higher
- Node.js 18+ and npm
- MongoDB cloud account (configured)
- Git for version control

---

## Running the Application

### Option 1: Run Backend First, Then Frontend

#### 1️⃣ Start Backend

```bash
cd Backend
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

**Expected Output:**
```
Tomcat started on port 8081 (http) with context path '/'
Started DemoApplication in 4.763 seconds
```

The API will be available at: `http://localhost:8081/api`

#### 2️⃣ Start Frontend (Development Mode)

In a new terminal:
```bash
cd Frontend
npm run dev
```

**Expected Output:**
```
  VITE v8.0.8  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

Open http://localhost:5173 in your browser.

---

### Option 2: Using Frontend Production Build

```bash
# Terminal 1 - Start Backend
cd Backend
java -jar target/demo-0.0.1-SNAPSHOT.jar

# Terminal 2 - Serve production build
cd Frontend
npx http-server dist --port 3000
```

Access the app at: `http://localhost:3000`

---

## Project Structure

```
Frontend/
├── Backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Java source code
│   │   │   └── resources/     # Configuration files
│   │   └── test/
│   ├── target/
│   │   └── demo-0.0.1-SNAPSHOT.jar  # Production JAR
│   ├── pom.xml
│   └── mvnw

├── Frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # React Context
│   │   └── App.jsx
│   ├── dist/                 # Production build
│   ├── package.json
│   └── vite.config.js

└── FINALIZATION_REPORT.md    # Detailed report
```

---

## Common Commands

### Backend Development
```bash
# Clean build
cd Backend && ./mvnw clean

# Build only
cd Backend && ./mvnw package -DskipTests

# Run with custom port
java -jar Backend/target/demo-0.0.1-SNAPSHOT.jar --server.port=9090

# View logs
java -jar Backend/target/demo-0.0.1-SNAPSHOT.jar -Dlogging.level.root=DEBUG
```

### Frontend Development
```bash
# Install dependencies
cd Frontend && npm install

# Development server
cd Frontend && npm run dev

# Production build
cd Frontend && npm run build

# Lint check
cd Frontend && npm run lint

# Preview production build
cd Frontend && npm run preview
```

---

## Accessing the Application

### Development Environment
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8081/api

### Production Environment
- **Frontend:** http://localhost:3000 (or deployed domain)
- **Backend API:** http://localhost:8081/api (or deployed domain)

---

## Login Credentials

**For Testing (you need to have existing users in MongoDB):**
1. Register a new account via the signup form
2. Or use existing credentials if already registered

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Facilities
- `GET /api/facilities` - List all facilities
- `GET /api/facilities/{id}` - Get facility details
- `POST /api/facilities` - Create facility (admin only)
- `PUT /api/facilities/{id}` - Update facility
- `DELETE /api/facilities/{id}` - Delete facility

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Tickets
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/{id}` - Get ticket details
- `PUT /api/tickets/{id}` - Update ticket

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read

---

## Troubleshooting

### Backend won't start on port 8081
```bash
# Check if port is in use
netstat -ano | findstr :8081

# Use a different port
java -jar Backend/target/demo-0.0.1-SNAPSHOT.jar --server.port=8082
```

### Frontend can't connect to backend
- Verify backend is running on port 8081
- Check if `http://localhost:8081/api` is accessible
- Verify CORS is configured in backend
- Check browser console for errors

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json

# Reinstall
npm install
```

### MongoDB connection errors
- Verify MongoDB credentials in `application.properties`
- Ensure MongoDB cluster is accessible from your network
- Check internet connectivity
- Verify IP whitelist in MongoDB Atlas

---

## Build Information

### Backend
- **Framework:** Spring Boot 4.0.5
- **Java Version:** 21
- **Build Tool:** Maven
- **Build Time:** ~7 seconds
- **JAR Size:** ~130 MB

### Frontend
- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.4
- **CSS Framework:** Tailwind CSS 4.2.2
- **Build Time:** ~378 ms
- **Bundle Size:** ~120 KB (gzipped)

---

## Environment Variables

### Backend (application.properties)
```properties
spring.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/database
app.jwt.secret=your-256-bit-secret-key
app.google.client-id=your-google-oauth-client-id
server.port=8081
```

### Frontend (src/services/api.js)
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

---

## Production Deployment

### Backend Deployment
1. Update `application.properties` with production credentials
2. Build: `./mvnw clean package -DskipTests`
3. Deploy JAR to cloud platform (AWS, Azure, etc.)
4. Configure environment variables on server
5. Set up SSL/TLS certificate

### Frontend Deployment
1. Build: `npm run build`
2. Contents of `dist/` folder can be deployed to:
   - AWS S3 + CloudFront
   - Netlify
   - Vercel
   - Any static hosting service
3. Configure API endpoint for production domain
4. Rebuild frontend with production API URL

---

## Support & Documentation

For detailed information, see: [FINALIZATION_REPORT.md](./FINALIZATION_REPORT.md)

---

**Status:** ✅ Fully Finalized & Production Ready  
**Last Updated:** April 18, 2026  
**Version:** 0.0.1-SNAPSHOT
