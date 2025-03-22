// src/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogIn, LogOut, Settings, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { name: "Upload", href: "/upload" },
    { name: "Search", href: "/search" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">CS DeepRead</h1>
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4 relative">
          {loggedIn && (
            <button className="relative text-gray-500 hover:text-black">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 w-2.5 h-2.5 rounded-full" />
            </button>
          )}

          {loggedIn ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm"
              >
                DL
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border text-sm z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                    <User className="w-4 h-4" /> <span>Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                    <Settings className="w-4 h-4" /> <span>Settings</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                    onClick={() => setLoggedIn(false)}
                  >
                    <LogOut className="w-4 h-4" /> <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLoggedIn(true)}
              className="text-sm font-medium text-blue-600 hover:underline flex items-center space-x-1"
            >
              <LogIn className="w-4 h-4" /> <span>Log in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}






/*"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const tabs = [
    { name: "Upload", href: "/upload" },
    { name: "Search", href: "/search" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">CS DeepRead</h1>
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}*/




/*"use client";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">CS DeepRead</h1>
      </div>
    </header>
  );
}*/
