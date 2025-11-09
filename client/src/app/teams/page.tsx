"use client";

import React from "react";
import { useGetTeamsQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {};

const Teams = (props: Props) => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !teams) return <p>Error getting teams</p>;

  const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 100 },
    { field: "teamName", headerName: "Team Name", width: 250 },
    { field: "productOwnerUserId", headerName: "Product Owner ID", width: 180 },
    {
      field: "projectManagerUserId",
      headerName: "Project Manager ID",
      width: 180,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }} className="flex p-8">
      <DataGrid rows={teams} columns={columns} />
    </div>
  );
};

export default Teams;
