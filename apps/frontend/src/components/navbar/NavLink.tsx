import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const baseButtonStyles =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors";
export const baseMenuLink = twMerge(
  baseButtonStyles,
  "text-white hover:bg-white hover:text-blue-700",
);
export const loginButtonStyles = twMerge(
  baseButtonStyles,
  "text-white hover:bg-blue-700",
);
export const registerButtonStyles = twMerge(
  baseButtonStyles,
  "bg-white text-blue-700 hover:bg-blue-100",
);
export const logoutButtonStyles = twMerge(
  baseButtonStyles,
  "bg-red-500 text-white hover:bg-red-600",
);

type NavLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  isMobile?: boolean;
};

export const NavLink = ({
  href,
  className,
  children,
  isMobile,
}: NavLinkProps) => (
  <Link
    href={href}
    className={twMerge(baseButtonStyles, className, isMobile && "block w-full")}
  >
    {children}
  </Link>
);
