import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            theme="dark"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
