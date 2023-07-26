import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import { LINKS } from "../shared/consts/LINKS";
import MainLayout from "../layouts/MainLayout";
import Tags from "../pages/Tags";

export const PUBLIC_ROUTES = createBrowserRouter([
  {
    path: LINKS.LOGIN,
    element: <Login />,
  },
  {
    path: LINKS.REGISTRATION,
    element: <Registration />,
  },
  {
    path: "*",
    element: <Navigate to={LINKS.LOGIN} />,
  },
]);

export const PRIVATE_ROUTES = createBrowserRouter([
  {
    path: LINKS.HOME,
    element: <MainLayout />,
    children: [
      {
        path: LINKS.HOME,
        index: true,
        element: <Home />,
      },
      {
        path: LINKS.TAGS,
        element: <Tags />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);
