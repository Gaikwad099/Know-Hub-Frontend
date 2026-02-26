# 📚 Knowledge Sharing Platform — Frontend

A modern, responsive React application for sharing technical knowledge with AI-powered writing assistance, built with **React 18**, **TipTap Editor**, and **Context API**.

---

## 🧭 Approach

### Architecture Overview

The frontend follows a **component-based architecture** with React best practices:

```
User Interface (Browser)
        ↓
   React Router (Navigation)
        ↓
   Pages (Route Components)
        ↓
   Context API (Auth State)
        ↓
   API Service Layer (Axios)
        ↓
   Backend API (Express)
```

Authentication state is managed globally via **React Context**, and all API calls are centralized in a service layer with automatic JWT token attachment.

### Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js              # Navigation bar with auth state
│   │   └── RichEditor.js          # TipTap rich text editor
│   ├── contexts/
│   │   └── AuthContext.js         # Global auth state management
│   ├── pages/
│   │   ├── HomePage.js            # Article list with search/filter
│   │   ├── ArticleDetailPage.js   # Single article view
│   │   ├── ArticleFormPage.js     # Create/edit article with AI
│   │   ├── DashboardPage.js       # User's articles dashboard
│   │   ├── LoginPage.js           # Login form
│   │   └── SignupPage.js          # Registration form
│   ├── services/
│   │   └── api.js                 # Axios instance & API calls
│   ├── App.js                     # Main app with routing
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
├── package.json
└── README.md
```

### Key Design Decisions

- **React Context for Auth** — Global authentication state accessible from any component without prop drilling
- **React Router v6** — Modern routing with protected routes and navigation guards
- **TipTap Editor** — Extensible rich text editor with clean API and customizable toolbar
- **Axios Interceptors** — Automatic JWT token attachment to all requests and 401 error handling
- **CSS Variables** — Consistent theming with easy customization via CSS custom properties
- **Component Composition** — Reusable components with clear single responsibilities
- **Controlled Forms** — All form inputs managed via React state for validation and submission

---

## 🤖 AI Usage

### Tools Used
- **ChatGPT** (GPT-4) — primary assistant for component structure and problem-solving
- **Claude** — code review and optimization suggestions

### Where AI Helped

| Area | How AI Was Used | What I Did Manually |
|---|---|---|
| **Project initialization** | Asked ChatGPT about React project setup best practices | Created app with `create-react-app`, removed unnecessary files, set up folder structure |
| **Component structure** | Got suggestions for component hierarchy and props | Built all components from scratch, implemented state management |
| **Rich text editor** | ChatGPT compared TipTap vs Quill vs CKEditor | Chose TipTap, installed it, configured toolbar, styled editor |
| **Authentication flow** | Asked about JWT storage strategies (localStorage vs cookies) | Implemented entire auth context, login/signup forms, protected routes |
| **API integration** | Got example of axios interceptor setup | Created API service layer, added all endpoints, error handling |
| **Routing** | ChatGPT suggested React Router v6 patterns | Implemented all routes, navigation guards, redirects |
| **Form validation** | Asked about validation approaches | Wrote all validation logic, error messages, user feedback |
| **UI/UX design** | Got color palette suggestions and layout ideas | Designed entire UI, wrote all CSS, responsive breakpoints |
| **State management** | Discussed Context API vs Redux tradeoffs | Implemented Context API, optimized re-renders |

### What Was Reviewed / Corrected Manually

- All form validation logic was written and tested manually
- Responsive design breakpoints were determined through testing on different devices
- Loading states and error handling were added manually to all API calls
- Editor content sanitization to prevent XSS was implemented manually
- Route protection logic was written from scratch
- All CSS styling and animations were created manually
- API error messages were formatted for user-friendly display
- Search and filter logic was implemented and optimized manually

---

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn**
- **Backend API** running on `http://localhost:5000`

### Environment Variables (Optional)

Create a `.env` file if you need to change the API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

> **Note:** By default, the app connects to `http://localhost:5000/api`. Only create `.env` if you need a different URL.

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/knowledge-platform-frontend.git
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## 🎨 Features

### User Features
✅ User registration with validation  
✅ Login with JWT authentication  
✅ Protected routes for authenticated users  
✅ Persistent login (localStorage)  
✅ Auto-logout on token expiration  

### Article Management
✅ Create articles with rich text editor  
✅ Edit and delete own articles  
✅ View all published articles  
✅ Article detail view with full content  
✅ Category and tag filtering  
✅ Real-time search functionality  
✅ Pagination for article lists  

### AI-Powered Features
✅ **Improve Clarity** — Rewrite content for better readability  
✅ **Fix Grammar** — Correct spelling and grammar errors  
✅ **Make Concise** — Remove redundancy and wordiness  
✅ **Suggest Titles** — Get AI-generated title suggestions  
✅ **Generate Summary** — Auto-create article summaries  
✅ **Suggest Tags** — Get relevant tag recommendations  

### UI/UX
✅ Responsive design (mobile, tablet, desktop)  
✅ Modern, clean interface with custom styling  
✅ Loading states for all async operations  
✅ Toast notifications for user feedback  
✅ Smooth animations and transitions  
✅ Accessible components with proper ARIA labels  

---

## 📱 Pages & Routes

### Public Routes

| Route | Component | Description |
|---|---|---|
| `/` | HomePage | List of all articles with search/filter |
| `/articles/:id` | ArticleDetailPage | Full article view with author info |
| `/login` | LoginPage | User login form |
| `/signup` | SignupPage | User registration form |

### Protected Routes (Require Authentication)

| Route | Component | Description |
|---|---|---|
| `/articles/new` | ArticleFormPage | Create new article with AI assist |
| `/articles/:id/edit` | ArticleFormPage | Edit existing article (author only) |
| `/dashboard` | DashboardPage | User's articles with quick actions |

---

## 🎨 Design System

### Color Palette
```css
--ink: #1a1a1a           /* Primary text */
--ink-light: #4a4a4a     /* Secondary text */
--ink-muted: #6b7280     /* Muted text */
--accent: #2563eb        /* Primary brand color */
--paper: #f9fafb         /* Background */
--paper-warm: #fef3c7    /* Warm background */
--border: #e5e7eb        /* Borders */
```

### Typography
- **Body**: Inter (sans-serif)
- **Headings**: Space Grotesk (display)
- **Base size**: 16px
- **Line height**: 1.6

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🔧 Technologies Used

- **React 18** — UI library with hooks
- **React Router v6** — Client-side routing
- **TipTap** — Rich text editor (based on ProseMirror)
- **Axios** — HTTP client with interceptors
- **React Hot Toast** — Toast notifications
- **date-fns** — Date formatting utility
- **Context API** — Global state management

---

## 📡 API Integration

All API calls are centralized in `src/services/api.js`:

### API Service Structure

```javascript
// Authentication
authAPI.signup(data)
authAPI.login(data)
authAPI.me()

// Articles
articlesAPI.getAll({ search, category, tag, page, limit })
articlesAPI.getMy()
articlesAPI.getById(id)
articlesAPI.create(data)
articlesAPI.update(id, data)
articlesAPI.delete(id)

// AI Features
aiAPI.improve(content, mode)
aiAPI.summary(content, title)
aiAPI.suggestTitle(content, currentTitle)
aiAPI.suggestTags(content, title)
```

### Automatic Token Management

The axios instance automatically:
- Attaches JWT token to all requests
- Redirects to login on 401 responses
- Clears auth state on logout

---

## 🛡️ Security Features

- **JWT token** stored in localStorage
- **Automatic token attachment** to all API requests
- **Protected routes** with authentication check
- **Auto-logout** on 401 responses
- **XSS prevention** in rich text content
- **Input sanitization** before API submission
- **HTTPS recommended** for production

---

## 🧪 Testing the Application

### Manual Testing Flow

1. **Signup Flow**
   - Navigate to `/signup`
   - Fill form with valid data
   - Verify redirect to home page
   - Check token in localStorage

2. **Login Flow**
   - Navigate to `/login`
   - Enter credentials
   - Verify redirect and auth state

3. **Create Article**
   - Click "New Article"
   - Write content in rich editor
   - Use AI features:
     - Click "Improve Clarity"
     - Click "Generate Summary"
     - Click "Suggest Titles"
   - Add category and tags
   - Publish article

4. **View Article**
   - Click on article card
   - Verify full content displays
   - Check view count increments

5. **Edit Article**
   - Click "Edit" on own article
   - Modify content
   - Save changes

6. **Search & Filter**
   - Use search bar
   - Filter by category
   - Filter by tag

7. **Delete Article**
   - Click "Delete" on own article
   - Confirm deletion

---

## 🐛 Troubleshooting

**Cannot connect to backend:**
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify `REACT_APP_API_URL` in `.env` (if set)

**Login not persisting:**
- Check browser localStorage for `token` and `user`
- Verify JWT token is not expired
- Clear localStorage and try again

**Rich editor not loading:**
- Clear browser cache
- Check console for errors
- Verify TipTap dependencies are installed

**AI features not working:**
- Backend will use mock responses if API unavailable
- Check network tab for API errors
- Verify you're logged in (AI features require auth)

**Styling issues:**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check if CSS file is loaded in Network tab

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your production API URL
5. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts and add `REACT_APP_API_URL` in Vercel dashboard.

---

## 🎯 Future Enhancements

- [ ] User profile pages with avatars
- [ ] Article bookmarking/favorites
- [ ] Comments and discussions
- [ ] Social sharing buttons
- [ ] Dark mode toggle
- [ ] Markdown support alongside rich text
- [ ] Code syntax highlighting
- [ ] Article drafts (save without publishing)
- [ ] Email notifications
- [ ] Article analytics dashboard

---

## 📝 Development Notes

- React StrictMode removed to prevent double API calls in development
- Editor content is sanitized before display to prevent XSS
- Images in articles are supported via URLs
- Tags are case-insensitive and automatically trimmed
- Search is debounced to reduce API calls
- Pagination defaults to 12 articles per page
- View count increments on each article view

---

## 🚀 Performance Optimizations

- Lazy loading for routes (code splitting)
- Debounced search input
- Optimized re-renders with React.memo
- Image lazy loading
- Minified production build
- CSS optimization

---

## 📄 License

MIT

## 👤 Author

Knowledge Sharing Platform Frontend - Built with React, TipTap, and Modern Web Technologies
