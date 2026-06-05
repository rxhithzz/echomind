"use client";

import { useRouter } from "next/navigation";

export default function Navbar({
  userName = "User",
  role = "student",
  pageTitle = "",
}) {
  const router = useRouter();

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Left — Logo + page title */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-gray-800">EchoMind</span>
          {pageTitle && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500 text-sm">{pageTitle}</span>
            </>
          )}
        </div>

        {/* Right — role badge + user name + logout */}
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              role === "teacher"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {role === "teacher" ? "Teacher" : "Student"}
          </span>

          {/* User name */}
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {userName}
          </span>

          {/* Logout button */}
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
