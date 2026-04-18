# CampsHub 🏫

A modern web application for managing campus facilities and bookings. Reserve study rooms, sports facilities, and other campus spaces all in one place!

## What's This All About?

CampsHub makes it super easy for students and staff to book campus facilities. Need a conference room for a group project? Want to reserve the basketball court? Done! Everything's just a few clicks away.

### Key Features

- **Easy Booking System** - Reserve facilities in seconds
- **Real-time Availability** - See what's available right now
- **User Authentication** - Secure login with JWT tokens
- **Support Tickets** - Report issues and get help quickly
- **Notifications** - Stay updated on your bookings
- **Responsive Design** - Works great on phones, tablets, and desktops

## Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Beautiful, utility-first styling
- **React Router** - Smooth page navigation
- **Axios** - Easy API calls
- **React Hot Toast** - Fancy notifications

### Backend
- **Spring Boot 4.0.5** - Java framework (solid and reliable)
- **MongoDB** - NoSQL database for flexibility
- **Spring Security** - Authentication & authorization
- **JWT** - Secure token-based auth
- **Maven** - Dependency management

## Getting Started

### What You'll Need

- Java 21 (for backend)
- Node.js 18+ (for frontend)
- npm or yarn (package manager)
- Git (version control)

### Installation

**1. Clone the repo** (if you haven't already)
```bash
git clone <repo-url>
cd Frontend
```

**2. Start the Backend**

```bash
cd Backend

# First time setup - build everything
./mvnw clean package -DskipTests

# Start the server
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

You should see something like:
```
Tomcat started on port 8081
Started DemoApplication in 4.7 seconds
```

The API is now running at `http://localhost:8081/api`

**3. Start the Frontend** (in a new terminal)

```bash
cd Frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173` and you're in!

## Project Structure

```
Frontend/
│
├── Backend/                          # Spring Boot API
│   ├── src/main/java/...            # Java source code
│   ├── src/main/resources/
│   │   └── application.properties    # Config file
│   ├── pom.xml                       # Maven dependencies
│   └── target/
│       └── demo-0.0.1-SNAPSHOT.jar   # Compiled JAR
│
├── Frontend/                         # React app
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── common/              # Reusable components
│   │   │   └── layout/              # Layout components
│   │   ├── pages/                   # Page views
│   │   ├── services/                # API calls
│   │   ├── context/                 # React Context (state management)
│   │   └── App.jsx                  # Main app component
│   ├── dist/                        # Production build
│   ├── package.json                 # NPM dependencies
│   └── vite.config.js              # Vite configuration
│
├── README.md                         # This file!
├── QUICK_START.md                   # Quick reference
└── FINALIZATION_REPORT.md           # Detailed report
```

## How to Use

### Creating an Account

1. Head to the app at `http://localhost:5173`
2. Click "Sign Up" and fill in your details
3. Verify your email (check your inbox)
4. You're ready to go!

### Booking a Facility

1. Go to the "Facilities" page
2. Browse available spaces or search for what you need
3. Click on a facility to see details
4. Select your preferred date and time
5. Confirm your booking
6. Check your bookings in the "My Bookings" section

### Reporting Issues

Found a problem? Need help?
1. Go to "Support" → "Tickets"
2. Create a new ticket describing the issue
3. We'll get back to you ASAP!

### Getting Notifications

We'll keep you in the loop:
- Booking confirmations
- Cancellations
- Updates from support team
- Check the notification bell in the top right

## Available API Endpoints

### Authentication
```
POST /api/auth/login          - Log in
POST /api/auth/register       - Create account
POST /api/auth/logout         - Log out
```

### Facilities
```
GET  /api/facilities          - List all facilities
GET  /api/facilities/:id      - Get facility details
POST /api/facilities          - Create (admin only)
PUT  /api/facilities/:id      - Update facility
```

### Bookings
```
GET  /api/bookings            - Get your bookings
POST /api/bookings            - Create new booking
GET  /api/bookings/:id        - Booking details
PUT  /api/bookings/:id        - Modify booking
DELETE /api/bookings/:id      - Cancel booking
```

### Tickets
```
GET  /api/tickets             - List support tickets
POST /api/tickets             - Create ticket
PUT  /api/tickets/:id         - Update ticket status
```

### Notifications
```
GET  /api/notifications       - Get notifications
PUT  /api/notifications/:id/read - Mark as read
```

## Deployment

### Deploy Frontend

**Option 1: Using Netlify**
```bash
npm run build
# Then drag & drop the `dist/` folder to Netlify
```

**Option 2: Using Vercel**
```bash
npm run build
# Connect your repo to Vercel, and it auto-deploys!
```

**Option 3: AWS S3 + CloudFront**
```bash
npm run build
# Upload `dist/` to S3 bucket
# Setup CloudFront for CDN
```

### Deploy Backend

**Deploy to AWS EC2, Azure VM, or DigitalOcean:**
1. Build the JAR: `./mvnw clean package -DskipTests`
2. Upload `Backend/target/demo-0.0.1-SNAPSHOT.jar` to your server
3. Configure environment variables (see below)
4. Run: `java -jar demo-0.0.1-SNAPSHOT.jar`

## Configuration

### Environment Variables (Backend)

Update `Backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8081
server.servlet.context-path=/api

# MongoDB (update with your credentials!)
spring.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (change this in production!)
app.jwt.secret=YourVeryLongSecretKeyThat256BitsLongForMaxSecurity

# Google OAuth (if using Google login)
app.google.client-id=your_client_id_here

# File uploads
spring.servlet.multipart.max-file-size=5MB
app.upload.dir=uploads
```

### API Configuration (Frontend)

Update `Frontend/src/services/api.js`:

```javascript
// For development
const API_BASE_URL = 'http://localhost:8081/api';

// For production
// const API_BASE_URL = 'https://api.yourdomain.com/api';
```

Then rebuild: `npm run build`

## Building & Testing

### Build Frontend
```bash
cd Frontend
npm run build          # Production build
npm run dev           # Development mode
npm run lint          # Check code quality
npm run preview       # Preview production build
```

### Build Backend
```bash
cd Backend
./mvnw clean package -DskipTests   # Build JAR
./mvnw test                        # Run tests
./mvnw spring-boot:run            # Dev mode
```

## Troubleshooting

### "Can't connect to backend"
- Make sure backend is running on port 8081
- Check firewall settings
- Verify API URL in `Frontend/src/services/api.js`

### "Port 8081 is already in use"
```bash
# Use a different port
java -jar Backend/target/demo-0.0.1-SNAPSHOT.jar --server.port=8082
```

### "npm install fails"
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection error"
- Check your internet connection
- Verify credentials in `application.properties`
- Make sure your IP is whitelisted in MongoDB Atlas
- Try using a different DNS server

### Frontend shows blank page
- Open browser DevTools (F12)
- Check Console tab for errors
- Make sure backend is running
- Try clearing browser cache (Ctrl+Shift+Delete)

## Performance Tips

- Frontend bundle is ~120KB gzipped (super fast!)
- Backend starts in ~5 seconds
- Database queries are optimized
- Images are lazy-loaded
- CSS is minified

## Security Notes ⚠️

Before going live:

1. **Change the JWT secret** - Use a strong 256-bit key
2. **Configure HTTPS** - Get an SSL certificate
3. **Update MongoDB credentials** - Don't use default ones
4. **Enable CORS properly** - Restrict to your domain
5. **Set strong passwords** - For admin accounts
6. **Keep dependencies updated** - Run `npm audit` regularly

## Contributing

Want to help make CampsHub better?

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## Running Tests

### Backend Tests
```bash
cd Backend
./mvnw test
```

### Frontend Tests
```bash
cd Frontend
npm test
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Frontend Build Time | ~378ms |
| Backend Startup | ~5s |
| Frontend Bundle (gzipped) | ~120KB |
| Backend JAR Size | ~130MB |
| Page Load Time | <1s |
| API Response Time | <200ms |

## Database Schema

The app uses MongoDB with these main collections:

- **Users** - User accounts and profiles
- **Facilities** - Campus spaces available for booking
- **Bookings** - Facility reservations
- **Tickets** - Support tickets
- **Notifications** - User notifications

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Update `cors.allowed-origins` in backend config |
| JWT token expired | Log out and log back in |
| File upload fails | Check max file size in settings |
| Slow queries | Add database indexes |
| Memory issues | Increase JVM heap size: `-Xmx1024m` |

## Version History

- **0.0.1** - Initial release (2026-04-18)

## Support

Got questions? Found a bug?

- Open an issue on GitHub
- Create a support ticket in the app
- Email the team: support@campshub.local

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Built with ❤️ for students and staff everywhere. Thanks to all the open-source projects that made this possible!

---

**Happy Booking!** 📚🏀🎓

If you found this helpful, please give it a star! ⭐

For more info, check out:
- [Quick Start Guide](./QUICK_START.md)
- [Detailed Finalization Report](./FINALIZATION_REPORT.md)
