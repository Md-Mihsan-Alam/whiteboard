# Real-Time Collaborative Whiteboard

A feature-rich, real-time collaborative whiteboard application built with React, Socket.io, and Canvas API. Draw, collaborate, and create together in real-time!

## ✨ Features

### 🎨 Drawing Tools
- **Pen** - Free-hand drawing with adjustable brush size
- **Text** - Add text anywhere on the canvas
- **Line** - Draw straight lines
- **Rectangle** - Create rectangles
- **Ellipse** - Draw circles and ellipses
- **Arrow** - Draw arrows with arrowheads
- **Triangle** - Create triangles
- **Star** - Draw 5-pointed stars
- **Eraser** - Erase with adjustable size
- **Laser** - Temporary red pointer for presentations

### 🖱️ Navigation & Selection
- **Hand Tool** - Pan around the large canvas (5000x3000px)
- **Selection Tool** - Select, move, and delete areas (Backspace to delete)

### 🎯 Customization
- **Color Picker** - Choose any color for drawing
- **Brush Size** - Adjustable from 1px to 20px
- **Real-time Collaboration** - Multiple users can draw simultaneously

### 📱 Responsive Design
- **Desktop** - Full toolbar on the right side
- **Mobile** - Hamburger menu with bottom toolbar
- **Touch Support** - Draw with finger on mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd whiteboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Socket.io server**
   ```bash
   node server.js
   ```

4. **Start the React development server** (in a new terminal)
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Open multiple tabs to test real-time collaboration!

## 🌐 Deploying to Vercel

### Step 1: Prepare for Deployment

1. **Update package.json** - Add build script for server:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "start": "node server.js"
     }
   }
   ```

2. **Create vercel.json** in project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       {
         "src": "/socket.io/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/$1"
       }
     ]
   }
   ```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Step 3: Update Socket.io Connection

**Manually update** the Socket.io connection in `src/App.jsx`:
```javascript
// Change line 33 from:
const newSocket = io('http://localhost:3001');

// To:
const newSocket = io(window.location.origin);
// OR to your deployed backend URL:
const newSocket = io('https://your-backend-url.vercel.app');
```

### Alternative: Deploy Frontend and Backend Separately

**Frontend (Vercel):**
1. Deploy only the React app to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`

**Backend (Railway/Heroku):**
1. Deploy `server.js` to Railway or Heroku
2. Update Socket.io URL in frontend to your backend URL

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, CSS3
- **Backend**: Node.js, Express, Socket.io
- **Icons**: React Icons
- **Canvas**: HTML5 Canvas API

## 📁 Project Structure

```
whiteboard/
├── src/
│   ├── ToolBox/
│   │   ├── ToolBox.jsx
│   │   └── ToolBox.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── server.js
├── package.json
├── vercel.json
└── README.md
```

## 🎮 How to Use

1. **Select a tool** from the toolbar
2. **Choose color and brush size** from controls
3. **Draw on the canvas** - click and drag to create
4. **Pan around** - use the hand tool to move around the large canvas
5. **Select areas** - use selection tool to move or delete content
6. **Collaborate** - share the URL with others for real-time collaboration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Known Issues

- Canvas size is optimized for desktop; mobile performance may vary with very large drawings
- Real-time sync depends on stable internet connection

## 🔮 Future Enhancements

- [ ] Undo/Redo functionality
- [ ] Save/Load drawings
- [ ] User cursors and names
- [ ] Layers support
- [ ] Export to PNG/PDF
- [ ] Room-based collaboration

---

**Happy Drawing! 🎨**