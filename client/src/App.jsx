import { createBrowserRouter, RouterProvider } from "react-router-dom";
// ── Auth Components
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

// ── Error Page
import ErrorPage from "./features/guest/pages/ErrorPage";

// ── Route Components
import GuestRoute from "./components/routes/GuestRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

// ── Layout Components
import GuestLayout from "./components/layouts/guest/GuestLayout";
import AppLayout from "./components/layouts/app/AppLayout";

// ── Guest Pages Components
import Home from "./features/guest/pages/Home";
import About from "./features/guest/pages/About";
import Contact from "./features/guest/pages/Contact";

// ── User Pages Components
import SettingPage from "./features/users/pages/SettingPage";
import ProfilePage from "./features/users/pages/ProfilePage";
import UserDashboard from "./features/users/pages/UserDashboard";
import UserCalendar from "./features/users/pages/UserCalendar";

// ── Project Pages Components
import Projects from "./features/project/pages/Projects";
import ProjectDetails from "./features/project/pages/ProjectDetails";

// ── Task Pages Components
import MyTask from "./features/tasks/pages/MyTask";

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
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },

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
          { path: "/projects", element: <Projects /> },
          { path: "/projects/:projectId", element: <ProjectDetails /> },
          { path: "/tasks", element: <MyTask /> },
        ],
      },
    ],
  },
  // ── Fallback
  { path: "*", element: <ErrorPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
