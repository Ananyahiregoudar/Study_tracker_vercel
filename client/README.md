# Study Management - Exam Tracker (React Frontend)

A React-based frontend application for tracking study progress and exam preparation.

## Features

- **Add Study Records**: Create new study records with student ID, subject, exam date, and planned study hours
- **View All Records**: Display all study records in an organized, responsive grid layout
- **Edit Records**: Update syllabus status and study hours completed
- **Delete Records**: Remove study records with confirmation
- **Progress Tracking**: Visual progress bars showing completion percentage
- **Status Management**: Color-coded status indicators for syllabus progress
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **React 18**: Modern React with functional components and hooks
- **CSS3**: Custom styling with responsive design
- **Fetch API**: For backend communication
- **Create React App**: Development environment and build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Backend Integration

This React app is designed to work with the Study Management API backend. Make sure your backend server is running on `http://localhost:5000` before starting the frontend.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)

## Application Structure

```
src/
├── components/
│   ├── StudyRecordForm.js    # Form for adding new records
│   ├── StudyRecordItem.js    # Individual record display/edit
│   └── StudyRecordList.js    # List of all records
├── services/
│   └── api.js                # API communication functions
├── App.js                    # Main application component
├── App.css                   # Application styling
└── index.js                  # React app entry point
```

## Key Components

### StudyRecordForm

- Handles form submission for new study records
- Validates input data
- Communicates with backend API

### StudyRecordItem

- Displays individual study record details
- Provides edit and delete functionality
- Shows progress visualization

### StudyRecordList

- Manages the display of all study records
- Handles loading states and errors
- Provides refresh functionality

## API Endpoints Used

- `POST /addStudyRecord`: Add new study record
- `GET /studyRecords`: Fetch all study records
- `PUT /studyRecord/:id`: Update study record
- `DELETE /studyRecord/:id`: Delete study record

## Styling

The application uses custom CSS with:

- Modern gradient designs
- Card-based layouts
- Responsive grid system
- Color-coded status indicators
- Hover effects and transitions

## Browser Support

This app supports all modern browsers including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
