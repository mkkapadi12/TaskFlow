import { createBrowserRouter, RouterProvider } from "react-router-dom";
// ── Auth Components
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

// ── Route Components
import GuestRoute from "./components/routes/GuestRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

// ── Layout Components
import GuestLayout from "./components/layouts/GuestLayout";
import AppLayout from "./components/layouts/AppLayout";

// ── Guest Pages Components
import Home from "./features/guest/pages/Home";
import About from "./features/guest/pages/About";
import Contact from "./features/guest/pages/Contact";

// ── User Pages Components
import SettingPage from "./features/users/pages/SettingPage";
import ProfilePage from "./features/users/pages/ProfilePage";
import UserDashboard from "./features/users/pages/UserDashboard";
import UserCalendar from "./features/users/pages/UserCalendar";
import ProjectPage from "./features/users/pages/ProjectPage";
import MyTask from "./features/users/pages/MyTask";

const router = createBrowserRouter([
  // ── Guest routes (redirect to /dashboard if already logged in)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/contact", element: <Contact /> },
        ],
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // ── Protected routes (redirect to /login if not logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <UserDashboard /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/settings", element: <SettingPage /> },
          { path: "/calendar", element: <UserCalendar /> },
          { path: "/projects", element: <ProjectPage /> },
          { path: "/tasks", element: <MyTask /> },
        ],
      },
    ],
  },
  // ── Fallback
  { path: "*", element: <LoginPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
