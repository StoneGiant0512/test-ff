# Project Dashboard Frontend

Frontend application for the Mini SaaS Dashboard project management system, built with Next.js and Tailwind CSS.

## Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

## Features

- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Project Table View** - Display all projects in a clean, organized table
- ✅ **Status Filtering** - Filter projects by status (All, Active, On Hold, Completed)
- ✅ **Search Functionality** - Search projects by name or assigned team member
- ✅ **Add Projects** - Create new projects via modal form
- ✅ **Edit Projects** - Update existing projects with pre-filled form
- ✅ **Delete Projects** - Remove projects with confirmation dialog
- ✅ **Loading States** - Visual feedback during API operations
- ✅ **Error Handling** - User-friendly error messages

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main dashboard page
│   └── globals.css           # Global styles
├── components/
│   ├── ProjectTable.tsx      # Table component for displaying projects
│   ├── ProjectModal.tsx     # Modal form for add/edit
│   ├── StatusFilter.tsx     # Status filter buttons
│   └── SearchBar.tsx        # Search input component
├── lib/
│   └── api.ts               # API client service
├── types/
│   └── project.ts           # TypeScript interfaces
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If not set, it defaults to `http://localhost:5000/api`.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Component Details

### ProjectTable
- Displays projects in a responsive table format
- Shows project name, status, deadline, team member, and budget
- Includes edit and delete action buttons
- Formats currency and dates for readability
- Color-coded status badges

### ProjectModal
- Modal form for creating and editing projects
- Validates all required fields
- Supports date picker for deadline
- Shows loading state during submission
- Handles errors gracefully

### StatusFilter
- Button-based filter for project status
- Visual indication of selected status
- Responsive button layout

### SearchBar
- Real-time search input
- Searches by project name or team member
- Includes search icon for better UX

## API Integration

The frontend communicates with the backend API through the `projectApi` service located in `lib/api.ts`. All API calls use axios and handle errors appropriately.

### API Endpoints Used

- `GET /api/projects` - Get all projects (with optional status and search filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full table view with all columns visible
- **Tablet** - Table with horizontal scrolling if needed
- **Mobile** - Stacked layout with touch-friendly buttons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
