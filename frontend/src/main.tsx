import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import { Layout } from "./components/Layout.tsx";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import Main from "./pages/Main.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import UserProfile from "./pages/UserProfile.tsx";
const router = createBrowserRouter([
  {
    path: "/profile",
    element: <Layout />,
    children: [
      {
        path: "/profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/",
    element: <Main />,
  },
  { path: "signup", element: <SignUp /> },
  { path: "login", element: <SignIn /> },
  { path: "reset-password", element: <ResetPassword /> },
  // {
  //   path: "/signup",
  //   element: <SignUp />,
  // },
  // {
  //   path: "/login",
  //   element: <SignIn />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
