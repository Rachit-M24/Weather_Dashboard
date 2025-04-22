import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./components/Home/Home";
import LocationDetails from "./pages/LocationDetails";
import AQIInfo from "./pages/AQIInfo";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./components/layouts/RootLayout";

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "location-details",
        element: <LocationDetails />,
      },
      {
        path: "aqi-info",
        element: <AQIInfo />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);