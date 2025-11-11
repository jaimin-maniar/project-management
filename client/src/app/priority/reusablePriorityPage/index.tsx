"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import ModalNewTask from "@/components/ModalNewTask";
import TaskCard from "@/components/TaskCard/TaskCard";
import { dataGridSxStyles } from "@/lib/utils";
import { Priority, Task, useGetTasksByUserQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

type Props = {
  priority: Priority;
};

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const userId = 155;
  const {
    data: tasks,
    isLoading,
    isError: isTaskError,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: userId === null,
  });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority,
  );

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 100,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
            {params?.value}
          </span>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 75,
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 130,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 130,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 130,
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
      renderCell: (params) => params?.value?.username || "Unknown",
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 150,
      renderCell: (params) => params?.value?.username || "Unassigned",
    },
  ];

  if (isTaskError || !tasks) return <div>Error fetching tasks</div>;
  if (filteredTasks?.length === 0)
    return (
      <div className="flex h-full w-full items-center justify-center text-3xl font-bold">
        No {priority} tasks found
      </div>
    );
  return (
    <div className="p-6">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name={`Priority: ${priority}`}
        buttonComponent={
          <button
            className="hover:bg-blue mr-3 bg-blue-600 px-4 py-2 font-bold text-white"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            New Task
          </button>
        }
      />
      <div className="mb-4 flex flex-col justify-center gap-2">
        <div>
          <button
            className={`px-4 py-2 ${view === "list" ? "bg-gray-300" : "bg-white"}`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-white"}`}
            onClick={() => setView("table")}
          >
            Table
          </button>
        </div>
        {isLoading ? (
          <>Loading...</>
        ) : view === "list" ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          view === "table" &&
          filteredTasks && (
            <div className="w-full">
              <DataGrid
                rows={filteredTasks}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReusablePriorityPage;
