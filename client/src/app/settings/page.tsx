"use client";

import React, { useEffect, useState } from "react";
import { setIsDarkMode } from "@/state";
import { useAppDispatch, useAppSelector } from "../redux";

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const darkmode = useAppSelector((state) => state.global.isDarkMode);

  const [notifications, setNotifications] = useState(true);
  const [username, setUsername] = useState("JohnDoe");

  // ✅ Apply dark mode class globally
  useEffect(() => {
    const html = document.documentElement;
    if (darkmode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkmode]);

  return (
    <div className="dark:bg-dark-bg flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300">
      <div className="dark:bg-dark-secondary dark:border-stroke-dark w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-colors duration-300">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <section>
            <h2 className="mb-3 text-lg font-medium text-gray-700 dark:text-gray-200">
              Profile
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="username"
                className="text-gray-600 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="dark:border-stroke-dark dark:bg-dark-tertiary w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-1/2 dark:text-gray-100"
              />
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="mb-3 text-lg font-medium text-gray-700 dark:text-gray-200">
              Preferences
            </h2>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Dark Mode
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={darkmode}
                  onChange={() => dispatch(setIsDarkMode(!darkmode))}
                  className="peer sr-only"
                />
                <div className="peer dark:bg-dark-tertiary h-6 w-11 rounded-full bg-gray-200 transition-all peer-checked:bg-blue-500"></div>
                <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>

            {/* Notifications Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Notifications
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="peer sr-only"
                />
                <div className="peer dark:bg-dark-tertiary h-6 w-11 rounded-full bg-gray-200 transition-all peer-checked:bg-green-600"></div>
                <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>
          </section>

          {/* Save Button */}
          <div className="dark:border-stroke-dark flex justify-end border-t border-gray-200 pt-4">
            <button
              onClick={() => alert("Settings saved!")}
              className="rounded bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-400"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
