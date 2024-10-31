"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../auth/supabaseClient";

type AuthContextType = {
  isUserLoggedIn: boolean;
  accessToken: string;
  userId: string | null;
  userEmail: string | null;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsUserLoggedIn(!!session);
      if (session?.access_token) {
        setAccessToken(session.access_token);
        localStorage.setItem("supabase.auth.token", session.access_token);
      } else {
        setAccessToken("");
        localStorage.removeItem("supabase.auth.token");
      }
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsUserLoggedIn(!!session);
      if (session?.access_token) {
        setAccessToken(session.access_token);
        localStorage.setItem("supabase.auth.token", session.access_token);
      } else {
        setAccessToken("");
        localStorage.removeItem("supabase.auth.token");
      }
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn,
        accessToken,
        userId,
        userEmail,
        setIsUserLoggedIn,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
