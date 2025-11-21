# Admin Panel

The Admin Panel is a React-based web application for managing interview collections and applicant data. It provides administrators with tools to create, monitor, and manage interview processes.

## Pages

### AdminHome.jsx - Dashboard

The main dashboard page serves as the central hub for administrators to overview and manage interview collections.

**Key Features:**
- **Statistics Overview**: Displays key metrics including total collections, active jobs, total applicants, and closed jobs
- **Collection Management**: View all interview collections in a grid layout with detailed cards
- **Search & Filter**: Search collections by company, role, or interview ID; filter by domain (Computer Science/Role Based) and level (Beginner/Intermediate/Advanced)
- **Create Collections**: Button to open a popup form for creating new interview collections
- **Collection Actions**: Each collection card includes options to view details or delete the collection

**Create Collection Process:**
- Set interview ID (auto-generated, can be regenerated)
- Enter company name and role
- Provide job description
- Select domain and interview level
- Set start and end date/time
- Optionally upload Excel file with applicant data (format: Name, Email, Mobile.no)

### AdminDetails.jsx - Collection Details

The details page provides comprehensive management tools for individual interview collections.

**Key Features:**
- **Collection Information**: Displays all collection details including company, role, interview ID, dates, domain, level, and applicant statistics
- **Edit Mode**: Toggle edit mode to modify collection details (company, role, description, dates, domain, level)
- **Applicant Management**: View all applicants in a detailed table format
- **Applicant Search & Filter**: Search by name, email, or mobile; filter by completion status or sort by score
- **Applicant Actions**:
  - Toggle interview completion status
  - Block/unblock applicant accounts
  - Delete individual applicants
- **Add Applicants**: Manually add new applicants with name, email, and mobile number
- **Export Data**: Download applicant data as CSV/Excel file
- **Collection Deletion**: Option to delete the entire collection

**Applicant Table Columns:**
- Name (with avatar)
- Email/Login ID
- Mobile/Password
- Score (with visual progress bar)
- Interview Status (Completed/Incomplete with toggle)
- Account Status (Active/Blocked with toggle)
- Actions (Block/Unblock, Delete)

## Technical Details

- Built with React and modern JavaScript
- Uses Lucide React for icons
- Styled with Tailwind CSS
- Communicates with backend API at `http://localhost:5000/api`
- Supports Excel file uploads for bulk applicant import
- Responsive design for desktop and mobile use

## API Endpoints Used

- `GET /api/collections` - Fetch all collections
- `POST /api/collections` - Create new collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `GET /api/collections/:id/users` - Fetch collection applicants
- `POST /api/collections/:id/users` - Add new applicant
- `PATCH /api/collections/:id/users/:userId` - Update applicant status
- `DELETE /api/collections/:id/users/:userId` - Delete applicant
