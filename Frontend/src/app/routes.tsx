import { createBrowserRouter } from "react-router";
import { LoginView } from "./components/LoginView";
import { RegisterView } from "./components/RegisterView";
import { SocialMediaApp } from "./components/SocialMediaApp";
import { ForgotPassword } from "./components/ForgotPassword";

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
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  }
]);
