import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/students", element: <StudentsPage /> },
      { path: "/attendance", element: <AttendancePage /> },
      { path: "/teams", element: <TeamsPage /> },
      { path: "/tasks", element: <TasksPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
