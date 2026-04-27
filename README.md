# 🏥 Hospital Management System

A comprehensive web-based hospital management system built with React, Node.js, and PostgreSQL. Manage patients, appointments, admissions, billing, rooms, OPD visits, and medical staff efficiently.

**Live Demo:** https://hospital-management-system-sakthipranavs04s-projects.vercel.app

---

## ✨ Features

### Patient Management
- Register and manage patient records
- Track patient history and demographics
- Automatic age calculation from date of birth
- Full CRUD operations with validation

### Appointment Scheduling
- Schedule appointments with specific doctors
- View daily and upcoming appointments
- Doctor availability tracking
- Email and phone validation

### In-Patient Management
- Admit patients to hospital rooms
- Assign doctors to admissions
- Track room occupancy
- Discharge patients with automatic room availability update
- View current patient information in rooms

### Out-Patient Services (OPD)
- Record outpatient visits
- Schedule follow-up appointments
- Doctor consultation tracking
- Visit history management

### Billing System
- Create and manage patient bills
- Track payment status
- Calculate pending balances
- Multiple payment methods support

### Room Management
- Create and manage hospital rooms
- Track room availability and occupancy
- View room details with current patient information
- Room type and floor organization

### Medical Staff Directory
- View all doctors with specialization
- Click doctor name to view detailed profile
- Department affiliation tracking
- Contact information and qualifications

### Authentication & Security
- User registration and login
- Session management
- Role-based access (future enhancement)
- Login required on every fresh page load

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.3
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Client:** PostgreSQL (pg)
- **Deployment:** Render
- **Password Hashing:** Base64 (upgrade to bcrypt for production)

### Database
- **Type:** PostgreSQL
- **Host:** Supabase (AWS ap-northeast-2)
- **Connection:** Session Pooler
- **Tables:** 9 (patients, appointments, admissions, outpatientvisits, bills, rooms, departments, doctors, users)

---

## � Database Schema

### Entity Relationship Diagram (ERD)

![ER Diagram - Hospital Management System](./public/er-diagram.png)

The system uses a normalized relational database with the following key entities:
- **PATIENT**: Core patient information with patient type (in-patient/out-patient)
- **APPOINTMENT**: Scheduled appointments linking patients and doctors
- **DOCTOR**: Medical staff with specialization and consultation fees
- **IN_PATIENT**: Hospital admissions with room allocation and treatment details
- **OUT_PATIENT**: Outpatient visit records with diagnosis and follow-up scheduling
- **BILL**: Billing records tracking payment status and amounts
- **ROOM**: Hospital room management with occupancy tracking

---

## �📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database (Supabase recommended)
- Git

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/SakthiPranavS04/Hospital-Management-System.git
cd "Hospital Management system"

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=https://hospital-management-system-v9be.onrender.com" > .env

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend folder
cd hospital-backend

# Install dependencies
npm install

# Create .env file
echo "DATABASE_URL=your_supabase_pooler_url" > .env
echo "FRONTEND_URL=http://localhost:5173" >> .env
echo "NODE_ENV=development" >> .env
echo "PORT=3001" >> .env

# Run server
npm start
```

### Database Setup

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Get connection string (use Session Pooler)

2. **Run Schema:**
   ```bash
   # In Supabase SQL Editor, run:
   cat hospital-backend/schema.sql
   ```

3. **Seed Sample Data:**
   ```bash
   # Run seed-doctors.sql to populate 8 doctors and 8 departments
   cat hospital-backend/seed-doctors.sql
   ```

4. **Connection Details:**
   - Host: `aws-1-ap-northeast-2.pooler.supabase.com`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: Check Supabase project settings

---

## 📁 Project Structure

```
Hospital Management system/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BackButton.jsx
│   │   ├── Banner.jsx       # Action buttons header
│   │   ├── PatientCard.jsx
│   │   ├── Sidebar.jsx      # Navigation menu
│   │   └── UI.jsx           # Card, Button, Modal, Table components
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard with stats & doctor directory
│   │   ├── Patients.jsx     # Patient management
│   │   ├── Appointments.jsx # Appointment scheduling
│   │   ├── InPatients.jsx   # In-patient admissions
│   │   ├── OutPatients.jsx  # OPD visits
│   │   ├── Billing.jsx      # Billing management
│   │   ├── Rooms.jsx        # Room management
│   │   └── Login.jsx        # Authentication
│   ├── context/             # React context (future use)
│   ├── data/
│   │   ├── api.js           # API endpoints and helper functions
│   │   └── mockData.js      # Fallback data
│   ├── utils/
│   │   └── formatters.js    # Date, time, and age formatting utilities
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── hospital-backend/
│   ├── server.js            # Express server & API endpoints
│   ├── schema.sql           # Database schema
│   ├── seed-doctors.sql     # Sample doctors and departments
│   ├── import-db.js         # Database import utility
│   └── package.json
├── public/                  # Static assets
├── package.json
├── vite.config.js
└── vercel.json              # Vercel deployment config
```

---

## 🔌 API Endpoints

All endpoints return `{ data: [...] }` for GET and `{ success: true, id: ... }` for POST/PUT.

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Patients
- `GET /patients` - Get all patients
- `POST /patients` - Create patient
- `PUT /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### In-Patients (Admissions)
- `GET /admissions` - Get all admissions
- `POST /admissions` - Create admission
- `PUT /admissions/:id` - Update/discharge admission
- `DELETE /admissions/:id` - Delete admission

### Out-Patients (OPD)
- `GET /outpatients` - Get all OPD visits
- `POST /outpatients` - Create OPD visit
- `PUT /outpatients/:id` - Update OPD visit
- `DELETE /outpatients/:id` - Delete OPD visit

### Billing
- `GET /bills` - Get all bills
- `POST /bills` - Create bill
- `PUT /bills/:id` - Update bill status/payment
- `DELETE /bills/:id` - Delete bill

### Rooms
- `GET /rooms` - Get all rooms
- `POST /rooms` - Create room (sets `is_available=true`)
- `PUT /rooms/:id` - Update room
- `DELETE /rooms/:id` - Delete room

### Doctors
- `GET /doctors` - Get all doctors with departments
- `POST /doctors` - Create doctor

### Departments
- `GET /departments` - Get all departments

---

## 📊 Database Schema

### Patients Table
```sql
patient_id, first_name, last_name, email, phone, 
date_of_birth, gender, address, city, state, 
zip_code, registered_at
```

### Appointments Table
```sql
appointment_id, patient_id, doctor_id, date, 
time, status, reason, created_at
```

### Admissions Table
```sql
admission_id, patient_id, doctor_id, room_id, 
admission_date, discharge_date, reason, status, 
created_at
```

### Out-Patient Visits Table
```sql
visit_id, patient_id, doctor_id, visit_date, 
follow_up_date, diagnosis, treatment, created_at
```

### Bills Table
```sql
bill_id, patient_id, admission_id, appointment_id, 
amount, paid, status, payment_method, 
payment_date, created_at
```

### Rooms Table
```sql
room_id, room_number, room_type, floor, 
department_id, is_available, created_at
```

### Doctors Table
```sql
doctor_id, first_name, last_name, specialization, 
qualification, department_id, contact_number, 
email, total_appointments, total_admissions
```

### Departments Table
```sql
department_id, department_name, description
```

### Users Table
```sql
user_id, username, password, email, full_name, created_at
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod

# Or connect GitHub to Vercel for auto-deploy
```

### Backend (Render)

```bash
# Connect GitHub repository to Render
# Set environment variables in Render dashboard
# Backend will auto-deploy on push

# Manual deployment:
npm run build
npm start
```

---

## 👥 Sample Data

### Seeded Doctors (8)
1. **Dr. Rajan Kumar** - Cardiologist (Cardiology)
2. **Dr. Priya Sharma** - Neurologist (Neurology)
3. **Dr. Amit Verma** - Orthopedist (Orthopedics)
4. **Dr. Divya Nair** - Pediatrician (Pediatrics)
5. **Dr. Suresh Reddy** - Surgeon (General Surgery)
6. **Dr. Meena Iyer** - Gynecologist (Obstetrics & Gynecology)
7. **Dr. Rakesh Patel** - Dermatologist (Dermatology)
8. **Dr. Anjali Singh** - Radiologist (Radiology)

### Test Login Credentials
**Note:** Create your own credentials via signup page or use:
```
Username: testuser
Password: test123
```

---

## 🎨 UI/UX Features

- **Responsive Design:** Mobile (480px), Tablet (768px), Desktop (1200px+)
- **Dark Mode Support:** CSS variables for theme customization
- **Floating Modals:** Doctor details, room information, form dialogs
- **Real-time Updates:** Data fetches on page load
- **Smooth Animations:** Hover effects, transitions, modal animations
- **Form Validation:** Client-side validation for all inputs
- **User Feedback:** Success/error messages with visual indicators
- **Dashboard Stats:** 6 key metrics with live updates

---

## 🔐 Authentication Flow

1. User opens webpage → **Login/Signup page displayed**
2. User creates account or logs in
3. Session stored temporarily in memory only (no localStorage persistence)
4. User navigates to dashboard and can use all features
5. **On page refresh → Must login again**

**Security Note:** No session persistence means users must re-authenticate on each page load (recommended for shared/public devices).

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL in .env file
- Check Supabase project is active
- Use Session Pooler connection string (not direct connection)
- Ensure firewall allows PostgreSQL port 5432

### Frontend API Errors
- Verify VITE_API_URL in .env file
- Check backend server is running
- Verify CORS is configured correctly on backend
- Check network tab in browser DevTools

### Doctor Dropdown Empty
- Ensure seed-doctors.sql has been run
- Verify doctors and departments are in database
- Check API endpoint `/doctors` returns data

### Rooms Not Showing Available
- Confirm rooms created with `is_available=true`
- Check database room records
- Verify admission discharge updates room availability

### Payment Status Not Updating
- Ensure PUT endpoint is called for bill update
- Check database transaction completed
- Verify payment_status field is correct

### Date Display Issues
- Check date format in API response (ISO 8601)
- Verify formatDate() utility is imported
- Ensure browser timezone is correct

---

## 📝 Code Conventions

- **File Naming:** PascalCase for components (Dashboard.jsx), camelCase for utilities (formatters.js)
- **Styling:** Inline styles with CSS variables (var(--bg), var(--accent), etc.)
- **API Calls:** Centralized in `data/api.js`
- **Date Format:** DD/MM/YYYY display, ISO 8601 storage
- **Error Handling:** Try-catch with user-friendly error messages
- **State Management:** React hooks (useState, useEffect)

---

## 🔄 Data Flow

```
User Login → App.jsx (auth state) → Pages fetch data via api.js 
→ Backend (Express) → Database (Supabase PostgreSQL) 
→ Response formatted → UI components render
```

---

## 📱 Responsive Breakpoints

- **Mobile:** < 480px (full-width, single column layouts)
- **Tablet:** 480px - 768px (2-column grids)
- **Desktop:** > 768px (3-column grids, full features)

---

## 🚦 Status Indicators

- **Appointments:** Scheduled, Completed, Cancelled
- **Admissions:** Active, Discharged, Pending
- **Bills:** Pending, Paid, Overdue
- **OPD:** Completed, Pending Follow-up

---

## 🔄 Recent Updates (April 26, 2026)

- ✅ Added dynamic Medical Staff Directory to Dashboard
- ✅ Implemented clickable doctor cards with floating detail modals
- ✅ Removed auto-refresh (was 10 seconds) → now loads once per session
- ✅ Removed session persistence → login required on every fresh page load
- ✅ Fixed foreign key constraints with dropdown selectors
- ✅ Added room detail floating modals
- ✅ Implemented discharge functionality with room availability sync
- ✅ Date formatting across all pages (DD/MM/YYYY)
- ✅ Cleaned up temporary documentation files

---

## 📞 Support & Contact

For issues or questions:
1. Check the Troubleshooting section above
2. Review database logs in Supabase dashboard
3. Check backend logs on Render
4. Verify network requests in browser DevTools

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Development

```bash
# Run development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

**Last Updated:** April 26, 2026  
**Frontend:** https://hospital-management-system-sakthipranavs04s-projects.vercel.app  
**Backend:** https://hospital-management-system-v9be.onrender.com  
**Repository:** https://github.com/SakthiPranavS04/Hospital-Management-System
