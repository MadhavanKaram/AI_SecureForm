# AI SecureForm

A full-stack web application for secure form analysis and AI-powered chat, built with React (frontend), Django REST Framework (backend), and Azure OpenAI integration.

## Features

- **User Authentication**: Signup, login, and logout with session-based authentication.
- **Multi-turn AI Chat**: Context-aware chat with Azure OpenAI, persistent chat history, and code copy functionality.
- **Form Analyzer**: Analyze form code for security, receive AI-generated recommendations, and copy secure code blocks.
- **Security Badges**: Visual security scoring and badge display for analyzed forms.
- **User Menu**: Top-right user menu with sign out, authentication status, and (optionally) username display.
- **SPA Navigation**: Sidebar and overlay navigation for a seamless single-page app experience.
- **Robust Error Handling**: Handles authentication, API, and runtime errors gracefully.
- **Modern UI/UX**: Responsive, accessible, and visually appealing design using Tailwind CSS.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Django, Django REST Framework
- **AI Integration**: Azure OpenAI (GPT)
- **Database**: MySQL

## Project Structure

```
AI_SecureFrom/
├── backend/
│   ├── analyzer/
│   │   ├── views.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── ...
│   ├── backend/
│   │   ├── settings.py
│   │   └── ...
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWithAI.js
│   │   │   ├── FormAnalyzer.js
│   │   │   ├── UserMenu.js
│   │   │   └── ...
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL

### Backend Setup (Django)
1. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
2. **Configure environment variables:**
   - Create a `.env` file in `backend/` with your Azure OpenAI and database credentials:
     ```env
     AZURE_OPENAI_API_KEY=your-key
     AZURE_OPENAI_ENDPOINT=your-endpoint
     AZURE_OPENAI_API_VERSION=2023-05-15
     AZURE_OPENAI_DEPLOYMENT=your-deployment
     DB_NAME=secureform_backend_db
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_HOST=localhost
     DB_PORT=3306
     ```
3. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```
4. **Run the backend server:**
   ```sh
   python manage.py runserver
   ```

### Frontend Setup (React)
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the frontend dev server:**
   ```sh
   npm start
   ```
   The app will be available at `http://localhost:3000`.

## API Endpoints

- `POST /api/signup/` — Register a new user
- `POST /api/login/` — Log in
- `POST /api/logout/` — Log out
- `GET  /api/user/` — Check authentication status (returns `{ status: 'authenticated' }` if logged in)
- `POST /api/chat/` — Multi-turn AI chat
- `POST /api/analyze/` — Analyze form code
- `GET  /api/history/` — Get submission history

## Environment Variables
- All sensitive keys and credentials are stored in `.env` (not committed to version control).

## Security Notes
- Session-based authentication is used for login/logout and user status.
- CSRF is exempted for API endpoints to support SPA usage.
- User details are not exposed via API for privacy.

## Development Notes
- All major features and bug fixes are documented in code comments and commit history.
- ESLint and code formatting are enforced in the frontend.
- The project is ready for further extension (e.g., JWT auth, more AI features).

## License
MIT License

---

**AI SecureForm** — Secure, analyze, and chat with your forms using AI.
