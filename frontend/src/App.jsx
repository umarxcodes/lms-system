import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "students", element: <StudentsPage /> },
      { path: "attendance", element: <AttendancePage /> },
      { path: "teams", element: <TeamsPage /> },
      { path: "tasks", element: <TasksPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
