
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as LinkIcon, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <LinkIcon className="mr-2 h-5 w-5" /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart2 className="mr-2 h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-primary-50 border-r border-gray-200 md:w-64 w-full">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">URL Shortener</h1>
        </div>
        <nav className="mt-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
