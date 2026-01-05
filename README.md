# Madrasvaasi 🏙️

A comprehensive web application for Chennai (Madras) residents and visitors, providing information about tourism, events, community forums, and emergency helpline numbers with interactive maps.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Seeding](#database-seeding)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [Contributing](#contributing)

## ✨ Features

### 1. **Tourism** 🗺️
- Browse Chennai's tourist attractions by category (Temples, Museums, Beaches, Parks, etc.)
- Filter by area (Mylapore, T. Nagar, Adyar, Egmore, etc.)
- Interactive map with location markers
- Detailed information including entry fees, timings, and best time to visit
- Google Maps directions integration
- Featured attractions showcase

### 2. **Helpline Numbers** 🚨
- Emergency services (112, 100, 101, 108)
- Hospital directory with locations
- Police station contacts
- Area-wise filtering
- Interactive map showing helpline locations
- Click-to-call functionality
- Google Maps directions to hospitals and police stations
- **Publicly accessible** (no authentication required for emergencies)

### 3. **Events** 🎉
- Community events calendar
- Event details with date, time, and location
- User authentication required

### 4. **Community Forum** 💬
- Discussion platform for Chennai residents
- User authentication required

### 5. **Interactive Maps** 🗺️
- Leaflet-based mapping with OpenStreetMap tiles
- Location markers for attractions and helplines
- Popup information cards
- Direct navigation to Google Maps

### 6. **User Authentication** 🔐
- JWT-based authentication
- Secure signup and login
- Protected routes for authenticated features
- Admin panel for content management

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.0.1
- **API:** Django REST Framework 3.14.0
- **Authentication:** djangorestframework-simplejwt 5.3.1
- **Database:** SQLite3
- **Additional Libraries:**
  - django-cors-headers 4.3.1
  - django-filter 25.2
  - drf-yasg 1.21.7 (API documentation)
  - python-dotenv 1.2.1

### Frontend
- **Framework:** React 19.2.3
- **Build Tool:** Vite 5.0.8
- **UI Library:** Material-UI 7.3.6
- **Styling:** TailwindCSS 3.4.1
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Maps:** Leaflet 1.9.4 & React-Leaflet 5.0.0
- **Additional Libraries:**
  - @emotion/react & @emotion/styled
  - react-fast-marquee 1.6.5

## 📁 Project Structure

```
madrasvaasi/
├── Backend/
│   ├── api/                          # Main API application
│   │   ├── management/
│   │   │   └── commands/             # Custom Django commands
│   │   │       ├── seed_tourism.py   # Seed tourism data
│   │   │       └── seed_helpline.py  # Seed helpline data
│   │   ├── models.py                 # Database models
│   │   ├── serializers.py            # DRF serializers
│   │   ├── views.py                  # API views
│   │   └── urls.py                   # API URL routing
│   ├── Backend/                      # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── db.sqlite3                    # SQLite database
│   ├── manage.py                     # Django management script
│   ├── .env                          # Environment variables (not in git)
│   └── .env.example                  # Example environment file
├── Frontend/
│   └── pjt_site/
│       ├── src/
│       │   ├── components/           # React components
│       │   │   ├── Home.jsx
│       │   │   ├── Navbar.jsx
│       │   │   ├── Tourism.jsx
│       │   │   ├── Helpline.jsx
│       │   │   ├── Events.jsx
│       │   │   ├── Forum.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Signup.jsx
│       │   │   └── PrivateRoute.jsx
│       │   ├── App.jsx               # Main app component
│       │   ├── main.jsx              # Entry point
│       │   └── index.css             # Global styles
│       ├── public/                   # Static assets
│       ├── package.json              # Node dependencies
│       ├── vite.config.js            # Vite configuration
│       └── tailwind.config.js        # Tailwind configuration
├── pyproject.toml                    # Poetry configuration
├── poetry.lock                       # Poetry lock file
├── .gitignore
└── README.md
```

## 📦 Prerequisites

- **Python:** 3.11 or higher
- **Node.js:** 16.x or higher
- **Poetry:** Python dependency management
- **npm:** Node package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd madrasvaasi
```

### 2. Backend Setup

```bash
# Install Python dependencies using Poetry
poetry install

# Navigate to Backend directory
cd Backend

# Copy environment variables
cp .env.example .env

# Run migrations
poetry run python manage.py migrate

# Create superuser for admin access
poetry run python manage.py createsuperuser

# Seed the database with sample data
poetry run python manage.py seed_tourism
poetry run python manage.py seed_helpline
```

### 3. Frontend Setup

```bash
# Navigate to Frontend directory
cd Frontend/pjt_site

# Install Node dependencies
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd Backend
poetry run python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/`

### Start Frontend Development Server

```bash
cd Frontend/pjt_site
npm run dev
```

The frontend will be available at `http://localhost:5173/`

### Access Admin Panel

Navigate to `http://127.0.0.1:8000/admin/` and login with your superuser credentials.

## 🔌 API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login (returns JWT tokens)
- `POST /api/token/refresh/` - Refresh JWT token

### Tourism
- `GET /api/tourism/categories/` - List tourism categories
- `GET /api/tourism/list/` - List all attractions (supports filtering)
- `GET /api/tourism/<id>/` - Get attraction details
- `GET /api/tourism/featured/` - List featured attractions

### Areas
- `GET /api/areas/` - List all Chennai areas

### Helpline (Public Access)
- `GET /api/helpline/categories/` - List helpline categories
- `GET /api/helpline/list/` - List all helplines (supports filtering)
- `GET /api/helpline/<id>/` - Get helpline details
- `GET /api/helpline/emergency/` - List emergency helplines

### API Documentation
- Visit `http://127.0.0.1:8000/swagger/` for interactive API documentation

## 🌱 Database Seeding

The application includes custom management commands to populate the database with sample data:

### Seed Tourism Data

```bash
poetry run python manage.py seed_tourism
```

This creates:
- 5 Areas (Mylapore, Adyar, T. Nagar, Egmore, Besant Nagar)
- 8 Tourism Categories (Temples, Museums, Beaches, Parks, etc.)
- 20 Tourist Attractions with coordinates, descriptions, timings, and entry fees

### Seed Helpline Data

```bash
poetry run python manage.py seed_helpline
```

This creates:
- 3 Helpline Categories (Emergency Services, Hospitals, Police Stations)
- 22 Helplines including:
  - 4 Emergency services (112, 100, 101, 108)
  - 10 Hospitals with coordinates
  - 8 Police stations with coordinates

### Reset and Re-seed

To delete existing data and re-seed:

```bash
# Delete all helplines
poetry run python manage.py shell -c "from api.models import Helpline; Helpline.objects.all().delete()"

# Delete all attractions
poetry run python manage.py shell -c "from api.models import Attraction; Attraction.objects.all().delete()"

# Re-seed
poetry run python manage.py seed_tourism
poetry run python manage.py seed_helpline
```

## 🔐 Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 👥 User Roles

### Regular Users
- Can browse tourism attractions
- Can view helpline numbers (no authentication required)
- Can access events and forums (requires authentication)

### Admin Users
- Full access to Django admin panel
- Can manage all content (attractions, helplines, events, categories, etc.)
- Can manage users

### Making a User an Admin

```bash
poetry run python manage.py shell -c "from django.contrib.auth.models import User; user = User.objects.get(username='<username>'); user.is_staff = True; user.is_superuser = True; user.save()"
```

## 🧪 Testing

### Run Backend Tests

```bash
cd Backend
poetry run python manage.py test
```

### Run Frontend Linting

```bash
cd Frontend/pjt_site
npm run lint
```

## 🏗️ Build for Production

### Frontend Production Build

```bash
cd Frontend/pjt_site
npm run build
```

The production-ready files will be in `Frontend/pjt_site/dist/`

### Backend Production Settings

- Set `DEBUG=False` in `.env`
- Configure a production database (PostgreSQL recommended)
- Set up static file serving
- Configure ALLOWED_HOSTS
- Use a production WSGI server (Gunicorn, uWSGI)

## 📝 Key Features Implementation

### Maps Integration
- Uses Leaflet with OpenStreetMap tiles
- Custom markers for locations
- Interactive popups with location details
- Google Maps directions integration via URL scheme: `https://www.google.com/maps/dir/?api=1&destination=LAT,LONG`

### Public vs Protected Routes
- Helpline endpoints use `AllowAny` permission class (no auth required)
- Tourism endpoints require authentication
- Events and Forum require authentication via JWT tokens

### JWT Authentication
- Access tokens for API authentication
- Refresh tokens for obtaining new access tokens
- Tokens stored in localStorage
- Automatic token inclusion in API requests via Axios interceptors

### Filtering
- Tourism: Filter by category, area, featured status
- Helpline: Filter by category, area, emergency status
- Implemented using django-filter

## 🤝 Contributing

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit with descriptive messages: `git commit -m "feat: add new feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Create a pull request

## 📄 License

This project is for educational and personal use.

## 👨‍💻 Author

**Srivatsav**
- Email: srivatsav.vijay2003@gmail.com

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for mapping library
- Material-UI for UI components
- Django and React communities

---

**Note:** This is an ongoing project. Features like Events and Forum are under development and will be enhanced in future updates.
