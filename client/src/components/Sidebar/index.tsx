"use client";

import { useAppSelector } from "@/app/redux";
import { setIsSideBarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  SidebarClose,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

type Props = {};

const Sidebar = (props: Props) => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useDispatch();
  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const classNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
  transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white ${isSideBarCollapsed ? "w-0 hidden" : "w-64"}
  `;
  return (
    <div className={classNames}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="flex min-h-14 w-64 items-center justify-between bg-white px-8 py-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            LOGO
          </div>
          <button>
            {isSideBarCollapsed ? null : (
              <SidebarClose
                onClick={() => {
                  dispatch(setIsSideBarCollapsed(!isSideBarCollapsed));
                }}
                className="size-6"
              />
            )}
          </button>
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.png" alt="user-icon" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wider dark:text-gray-200">
              JAIMIN's TEAM
            </h3>
            <div className="mt-1 flex items-center justify-start gap-1">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-sx text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* Navbar Links */}
        <nav className="z-10 w-full">
          <SidebarLink Icon={Home} label="Home" href="/" />
          <SidebarLink Icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink Icon={Search} label="Search" href="/search" />
          <SidebarLink Icon={Settings} label="Settings" href="/settings" />
          <SidebarLink Icon={User} label="Users" href="/users" />
          <SidebarLink Icon={Users} label="Teams" href="/teams" />
        </nav>
        <button
          className="flex items-center justify-between px-8 py-3"
          onClick={() => setShowProjects((prev) => !prev)}
        >
          <span>Projects</span>
          {showProjects ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
        {/* PROJECTS LIST */}

        {showProjects &&
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              Icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}

        <button
          className="flex items-center justify-between px-8 py-3"
          onClick={() => setShowPriority((prev) => !prev)}
        >
          <span>Priorities</span>
          {showPriority ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              Icon={AlertCircle}
              href="/priority/urgent"
              label="Urgent"
            />
            <SidebarLink
              Icon={ShieldAlert}
              href="/priority/high"
              label="High"
            />
            <SidebarLink
              Icon={AlertTriangle}
              href="/priority/medium"
              label="Medium"
            />
            <SidebarLink Icon={AlertOctagon} href="/priority/low" label="Low" />
            <SidebarLink
              Icon={Layers3}
              href="/priority/backlog"
              label="backlog"
            />
          </>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  Icon: LucideIcon;
  label: string;
  // isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  Icon: Icon,
  label,
  // isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();

  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  const screenWidth = window.innerWidth;

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute top-0 left-0 h-full w-[5px] bg-blue-200" />
        )}
        <Icon className="size-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
