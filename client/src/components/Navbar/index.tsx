import React from "react";
import { CrossIcon, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSideBarCollapsed } from "@/state";
type Props = {};

const Navbar = () => {
  const dispatch = useDispatch();
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {isSideBarCollapsed ? (
          <button
            onClick={() => dispatch(setIsSideBarCollapsed(!isSideBarCollapsed))}
          >
            <Menu className="size-6" />
          </button>
        ) : null}

        <div className="relative flex h-min w-[200px]">
          <Search className="absolute top-1/2 left-1 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
      {/* Icons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? "rounded-full p-2 dark:hover:bg-gray-900"
              : "rounded-full p-2 hover:bg-gray-100"
          }
        >
          {isDarkMode ? (
            <Sun className="size-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="size-6 cursor-pointer dark:text-white" />
          )}
        </button>
        <Link
          href="/settings"
          className="h-min w-min rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Settings className="size-6 cursor-pointer dark:text-white" />
        </Link>
        <div className="mr-5 ml-2 hidden min-h-8 w-px bg-gray-200 md:inline-block" />
      </div>
    </div>
  );
};

export default Navbar;
