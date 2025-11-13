"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetUsersQuery, User } from "@/state/api";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

const Users: React.FC = () => {
  const { data, isLoading, isError } = useGetUsersQuery();
  const columns: GridColDef[] = [
    {
      field: "profilePictureUrl",
      headerName: "Profile",
      width: 100,

      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10, // Add space between image and username
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid #d1d5db", // optional border similar to tailwind's gray-300
            width: 50,
            height: " 100%",
          }}
        >
          <Image
            src={`/${params.value}`}
            alt={params.row.username}
            width={24}
            height={24}
            className="dark:border-stroke-dark h-12 w-12 rounded-full border border-gray-300 object-cover"
          />
        </div>
      ),

      sortable: false,
      filterable: false,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "teamId",
      headerName: "Team ID",
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "cognitoId",
      headerName: "Cognito ID",
      flex: 1.2,
      minWidth: 200,
    },
  ];

  if (isLoading)
    return (
      <div className="dark:bg-dark-bg flex min-h-screen items-center justify-center bg-gray-100">
        <CircularProgress color="primary" />
      </div>
    );

  if (isError)
    return (
      <div className="dark:bg-dark-bg flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-600 dark:text-red-400">Failed to load users.</p>
      </div>
    );

  return (
    <div className="dark:bg-dark-bg min-h-screen bg-gray-100 p-6 transition-colors duration-300">
      <div className="dark:bg-dark-secondary dark:border-stroke-dark mx-auto w-full max-w-6xl rounded-lg bg-white p-4 shadow-lg transition-colors duration-300 dark:border">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Users
        </h1>

        <div
          className="h-[600px] w-full transition-colors duration-300"
          style={{
            backgroundColor: "transparent",
          }}
        >
          <DataGrid
            rows={data || []}
            columns={columns}
            getRowId={(row) => row.userId}
            disableRowSelectionOnClick
            sx={{
              color: "var(--mui-palette-text-primary)",
              backgroundColor: "transparent",
              borderColor: "transparent",
              "& .MuiDataGrid-cell": {
                color: "rgb(55,65,81)", // gray-700
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgb(243,244,246)", // gray-100
                color: "rgb(31,41,55)", // gray-800
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(59,130,246,0.05)", // blue hover
              },
              "&.dark .MuiDataGrid-cell": {
                color: "#d1d5db", // gray-300
              },
              "&.dark .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--color-dark-secondary)",
                color: "#e5e7eb", // gray-200
              },
              "&.dark .MuiDataGrid-row:hover": {
                backgroundColor: "var(--color-dark-tertiary)",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
