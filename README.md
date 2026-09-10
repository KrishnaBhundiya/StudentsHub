# StudentsHub - Student Career Hub Platform

A comprehensive career management platform for students, featuring job applications, scholarship opportunities, event registrations, and counselor appointments.

## Features

- **Student Dashboard**: Browse and apply for internships, jobs, scholarships, and register for events
- **Counselor Dashboard**: Manage appointments and availability
- **Event Hoster Dashboard**: Create and manage events, view registrations
- **Job Poster Dashboard**: Post jobs and manage applications
- **AI-Powered Job Matching**: Get personalized job recommendations
- **Secure Authentication**: Role-based access control
- **Persistent Data Storage**: All data stored locally using localStorage

## Tech Stack

- HTML5, CSS3, JavaScript
- Vite for development
- Google Gemini AI for job matching
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/StudentsHub.git
   cd StudentsHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
StudentsHub/
├── index.html              # Main student dashboard
├── login.html              # Login and signup page
├── councillor-dashboard.html
├── hoster-dashboard.html
├── poster-dashboard.html
├── shared-data.js          # Centralized data management
├── components/             # React components (if using)
├── package.json
└── README.md
```

## User Roles

1. **Student**: Browse opportunities, apply for jobs/scholarships, register for events, book appointments
2. **Counselor**: Manage appointments, set availability
3. **Event Hoster**: Create events, view registrations
4. **Job Poster**: Post jobs, manage applications

## Data Persistence

All data is stored locally in the browser using localStorage. This means:
- Data persists across page refreshes
- Data persists when users log out and log back in
- No external database required
- All changes are automatically saved

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

This project is private and proprietary.

## Contributing

This is a private project. Contributions are not currently accepted.
