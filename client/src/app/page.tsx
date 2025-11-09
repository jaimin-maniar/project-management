import React from "react";
import HomePage from "./home/page";
import { useGetTasksQuery } from "@/state/api";

const Home = () => {
  return (
    <div className="">
      <HomePage />
    </div>
  );
};

export default Home;
