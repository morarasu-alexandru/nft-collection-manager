import {
  NavLink,
  loginButtonStyles,
  registerButtonStyles,
  baseMenuLink,
  logoutButtonStyles,
} from "./NavLink";
import { pageUrl } from "@/config/pageUrl";
import { twMerge } from "tailwind-merge";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  isMobile?: boolean;
  onLogout: () => void;
};

export const AuthButtons = ({
  isLoggedIn,
  isMobile,
  onLogout,
}: AuthButtonsProps) => {
  if (!isLoggedIn) {
    return (
      <>
        <NavLink
          href={pageUrl.login}
          className={loginButtonStyles}
          isMobile={isMobile}
        >
          Login
        </NavLink>
        <NavLink
          href={pageUrl.register}
          className={registerButtonStyles}
          isMobile={isMobile}
        >
          Register
        </NavLink>
      </>
    );
  }

  return (
    <>
      <NavLink
        href={pageUrl.assets}
        className={baseMenuLink}
        isMobile={isMobile}
      >
        My Assets
      </NavLink>
      <button
        onClick={onLogout}
        className={twMerge(logoutButtonStyles, isMobile && "w-full")}
      >
        Logout
      </button>
    </>
  );
};
