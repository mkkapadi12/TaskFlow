import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './components/layouts/app/AppLayout';
// ── Layout Components
import GuestLayout from './components/layouts/guest/GuestLayout';
// ── Route Components
import GuestRoute from './components/routes/GuestRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import FullPageSpinner from './components/ui/loader';

// ── Lazy Loaded Page Components
const ForgotPasswordPage = lazy(
  () => import('./features/auth/pages/ForgotPasswordPage')
);
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'));
const ResetPasswordPage = lazy(
  () => import('./features/auth/pages/ResetPasswordPage')
);
const About = lazy(() => import('./features/guest/pages/About'));
const Contact = lazy(() => import('./features/guest/pages/Contact'));
const Docs = lazy(() => import('./features/guest/pages/Docs'));
const ErrorPage = lazy(() => import('./features/guest/pages/ErrorPage'));
const Home = lazy(() => import('./features/guest/pages/Home'));
const PrivacyPolicy = lazy(
  () => import('./features/guest/pages/PrivacyPolicy')
);
const AdvancedAnalytics = lazy(
  () => import('./features/project/pages/AdvancedAnalytics')
);
const ProjectDetails = lazy(
  () => import('./features/project/pages/ProjectDetails')
);
const Projects = lazy(() => import('./features/project/pages/Projects'));
const MyTask = lazy(() => import('./features/tasks/pages/MyTask'));
const ProfilePage = lazy(() => import('./features/users/pages/ProfilePage'));
const SettingPage = lazy(() => import('./features/users/pages/SettingPage'));
const UserCalendar = lazy(() => import('./features/users/pages/UserCalendar'));
const UserDashboard = lazy(
  () => import('./features/users/pages/UserDashboard')
);
const Requirements = lazy(
  () => import('./features/documents/pages/Requirements')
);

const router = createBrowserRouter([
  // ── Guest routes (redirect to /dashboard if already logged in)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/about', element: <About /> },
          { path: '/contact', element: <Contact /> },
          { path: '/docs', element: <Docs /> },
          { path: '/privacy', element: <PrivacyPolicy /> },
        ],
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  {
    path: 'forgot-password',
    element: <ForgotPasswordPage />,
  },

  { path: 'reset-password', element: <ResetPasswordPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <UserDashboard /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingPage /> },
          { path: '/calendar', element: <UserCalendar /> },
          { path: '/projects', element: <Projects /> },
          { path: '/projects/:projectId', element: <ProjectDetails /> },
          {
            path: '/projects/:projectId/analytics',
            element: <AdvancedAnalytics />,
          },
          { path: '/analytics', element: <AdvancedAnalytics /> },
          { path: '/documents', element: <Requirements /> },
          { path: '/tasks', element: <MyTask /> },
        ],
      },
    ],
  },
  // ── Fallback
  { path: '*', element: <ErrorPage /> },
]);

const App = () => (
  <Suspense fallback={<FullPageSpinner />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;
