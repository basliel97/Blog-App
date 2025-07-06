# 🚀 BlogHub - Modern React Blog Application

A full-featured blog application built with React, Material-UI, and Zustand. Features user authentication, post management, comments, and a responsive design with dark/light theme support.

![BlogHub Preview](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-blue?logo=material-ui)
![Zustand](https://img.shields.io/badge/Zustand-5.0.6-purple)
![Vite](https://img.shields.io/badge/Vite-7.0.0-orange?logo=vite)

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Protected Routes** with automatic redirect
- **Persistent Sessions** with localStorage
- **User Profile Management**

### 📝 Blog Post Management
- **Create, Read, Update, Delete** blog posts
- **Rich Text Content** with markdown support
- **Author Attribution**

### 💬 Interactive Features
- **Comment System** with real-time updates

### 🎨 Modern UI/UX
- **Responsive Design** - Works on all devices
- **Dark/Light Theme** toggle
- **Material-UI Components** for consistent design
- **Smooth Animations** and transitions
- **Loading States** and error handling

### 🛠️ Technical Features
- **State Management** with Zustand
- **API Integration** with Axios
- **Form Validation** with Yup
- **React Hook Form** for efficient forms
- **React Router** for navigation

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm**
- **Backend API** running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/basliel97/bloghub.git
   cd bloghub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
bloghub/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration
│   │   └── axiosInstance.js
│   ├── components/        # Reusable components
│   │   ├── Footer.jsx
│   │   ├── NavBar.jsx
│   │   ├── PostCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/            # Page components
│   │   ├── CreatePost.jsx
│   │   ├── EditPost.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── PostDetails.jsx
│   │   ├── ProfilePage.jsx
│   │   └── Register.jsx
│   ├── store/            # Zustand stores
│   │   ├── authStore.js
│   │   ├── CommentStore.js
│   │   ├── postStore.js
│   │   └── themeStore.js
│   ├── theme/            # Theme configuration
│   │   └── theme.js
│   ├── App.jsx           # Main app component
│   └── main.jsx          # App entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Configuration

### Backend API

The application expects a backend API running on `http://localhost:3000`. Update the API base URL in `src/api/axiosInstance.js` if needed:

```javascript
const API_CONFIG = {
  baseURL: "http://localhost:3000", // Change this to your backend URL
  timeout: 10000,
  // ...
};
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Production
npm run build        # Create optimized build
```

## 🏗️ Architecture

### State Management (Zustand)

The application uses Zustand for state management with the following stores:

- **`authStore`** - User authentication and session management
- **`postStore`** - Blog posts and post-related operations
- **`CommentStore`** - Comments and comment interactions
- **`themeStore`** - UI theme preferences

### Component Architecture

- **Functional Components** with React Hooks
- **Memoized Components** for performance optimization
- **Custom Hooks** for reusable logic
- **Material-UI** for consistent design system

### API Integration

- **Axios** for HTTP requests
- **Request/Response Interceptors** for authentication
- **Error Handling** with user-friendly messages
- **Loading States** for better UX

## 🎨 Customization

### Themes

The application supports both light and dark themes. Customize themes in `src/theme/theme.js`:

```javascript
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      // Customize colors here
    },
    // ...
  },
});
```

### Styling

- **Material-UI** `sx` prop for component styling
- **Responsive Design** with breakpoints
- **CSS-in-JS** approach for maintainable styles

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to Netlify

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat: add user authentication
fix: resolve navigation issue
docs: update README
style: improve button styling
refactor: optimize component performance
test: add unit tests
chore: update dependencies
```

## 📝 API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /users/register` - User registration
- `GET /auth/me` - Get current user

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Comments
- `GET /comments/post/:postId` - Get post comments
- `POST /comments` - Add comment

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure your backend is running on `http://localhost:3000`
   - Check network connectivity
   - Verify API endpoints

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token validity
   - Verify login credentials

3. **Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all imports are correct


## 🙏 Acknowledgments

- **Material-UI** for the component library
- **Zustand** for state management
- **Vite** for the build tool
- **React** team for the amazing framework


---

**Made with ❤️ by [Basliel Getu]**

[![GitHub stars](https://img.shields.io/github/stars/basliel97/bloghub?style=social)](https://github.com/basliel97/bloghub)
