🎨 Speech to Text Frontend

This is the frontend of the Speech to Text Web Application, developed using Next.js and Tailwind CSS.
It connects seamlessly to the Flask backend API to convert live audio input into text.

🚀 Live Links
🌐 Frontend (Live): https://speech-to-text-frontend.vercel.app
⚙️ Backend API: https://speech-to-text-backend-a3mh.onrender.com

About the Frontend
The frontend provides a clean and user-friendly interface for users to record speech, send it to the backend API, and view the transcribed text in real time.

Key Features:
🎙️ Audio recording directly from the browser
⚡ Fast API integration with live backend
💬 Displays transcribed text dynamically
📱 Fully responsive UI built with Tailwind CSS

🛠️ Tech Stack
Framework: Next.js (React)
Styling: Tailwind CSS
API Calls: Axios / Fetch API
Hosting: Vercel


📦 Folder Structure
frontend/
├── pages/
│   ├── index.js
│   ├── _app.js
│   └── api/
├── public/
│   ├── favicon.ico
│   └── icons/
├── styles/
│   └── globals.css
└── package.json

⚙️ Environment Variable



To connect with the backend API, include this in your .env file:

NEXT_PUBLIC_API=https://speech-to-text-backend-a3mh.onrender.com




