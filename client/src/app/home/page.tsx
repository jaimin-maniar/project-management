"use client";
import { Listbox } from "@headlessui/react";
import {
  Priority,
  Project,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import { useMemo, useState } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClassNames } from "@emotion/react";
import { dataGridSxStyles } from "@/lib/utils";

const COLORS = ["#0088fe", "#00c49f", "#ffbb28", "#ff8042"];

const HomePage = () => {
  const [projectId, setProjectId] = useState(1);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId });

  const chartColors = useMemo(
    () =>
      isDarkMode
        ? {
            bar: "#8884d8",
            barGrid: "#303030",
            pieFill: "#4a90e2",
            text: "#ffffff",
          }
        : {
            bar: "#8884d8",
            barGrid: "#e0e0e0",
            pieFill: "#82ca9b",
            text: "#000000",
          },
    [isDarkMode],
  );

  const priorityCount = tasks?.reduce(
    (acc: Record<Priority, number>, task) => {
      const { priority } = task;
      if (priority === undefined || priority === null) return acc;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {} as Record<Priority, number>,
  );

  const taskDistribution = (Object.keys(priorityCount || {}) as Priority[]).map(
    (priority) => ({
      name: priority,
      count: priorityCount?.[priority],
    }),
  );

  const statusCount = projects?.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      if (status === undefined || status === null) return acc;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const projectStatus = (Object.keys(statusCount || {}) as Priority[]).map(
    (project) => ({
      name: project,
      count: statusCount?.[project] || 0,
    }),
  );

  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    { field: "priority", headerName: "Priority", width: 200 },
    { field: "dueDate", headerName: "Due Date", width: 200 },
  ];

  if (projectsLoading) return <p>Loading projects...</p>;
  if (projectsError) return <p>Error loading projects.</p>;
  if (tasksLoading) return <p>Loading tasks...</p>;
  if (tasksError) return <p>Error loading tasks.</p>;
  return (
    <div>
      <div className="p-6">
        <h1>Select Project</h1>
        <Listbox value={projectId} onChange={setProjectId}>
          <div className="relative w-60 text-black dark:text-white">
            <Listbox.Button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-black dark:bg-black dark:text-white">
              {projects?.find((p) => p.id === projectId)?.name ||
                "Select Project"}
            </Listbox.Button>
            <Listbox.Options className="dark:bg-dark-secondary absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-md dark:text-white">
              {projects?.map((project) => (
                <Listbox.Option
                  key={project.id}
                  value={project.id}
                  className={({ active }) =>
                    `cursor-pointer rounded px-4 py-2 text-white select-none hover:bg-blue-100 hover:text-black ${
                      active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                    }`
                  }
                >
                  {project.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
      <div className="container p-6">
        <Header name="Project Management Dashboard" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="dark:bg-dark-secondary rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Task Priority Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.barGrid}
                />

                <XAxis dataKey="name" stroke={chartColors.text} />
                <YAxis stroke={chartColors.text} />
                <Tooltip
                  contentStyle={{
                    width: "min-content",
                    height: "min-content",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill={chartColors.bar} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dark:bg-dark-secondary rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Project Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={projectStatus} dataKey="count" fill="#82ca9d" label>
                  {projectStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="dark:bg-dark-secondary rounded-lg bg-white p-4 shadow md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Your Tasks
            </h3>
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid
                rows={tasks}
                columns={taskColumns}
                checkboxSelection
                loading={tasksLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
