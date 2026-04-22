import { createBrowserRouter } from "react-router";
import { LoginView } from "./components/LoginView";
import { RegisterView } from "./components/RegisterView";
import { SocialMediaApp } from "./components/SocialMediaApp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SocialMediaApp,
  },
  {
    path: "/login",
    Component: LoginView,
  },
  {
    path: "/register",
    Component: RegisterView,
  },
]);
