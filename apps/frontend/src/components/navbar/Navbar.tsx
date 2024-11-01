"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../auth/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "./Logo";
import { HamburgerButton } from "./HamburgerButton";
import { AuthButtons } from "./AuthButtons";
import { pageUrl } from "@/config/pageUrl";

export default function Navbar() {
  const { isUserLoggedIn, userEmail } = useAuth(); // Add userEmail from context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        router.push(pageUrl.home);
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  return (
    <div className="mb-8">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>

            <div className="flex items-center sm:hidden">
              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>

            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="flex items-center space-x-4">
                {isUserLoggedIn && userEmail && (
                  <div className="flex items-center text-white/80 bg-white/10 px-3 py-1.5 rounded-md">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{userEmail}</span>
                  </div>
                )}
                <AuthButtons
                  isLoggedIn={isUserLoggedIn}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${isMenuOpen ? "block" : "hidden"} sm:hidden bg-blue-700`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isUserLoggedIn && userEmail && (
              <div className="flex items-center text-white/80 bg-white/10 px-3 py-2 rounded-md mx-2">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-medium">{userEmail}</span>
              </div>
            )}
            <AuthButtons
              isLoggedIn={isUserLoggedIn}
              isMobile={true}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
