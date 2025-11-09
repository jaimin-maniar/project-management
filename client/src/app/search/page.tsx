"use client";

import { useSearchQuery } from "@/state/api";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard/TaskCard";
import ProjectCard from "@/components/ProjectCard";
import UserCard from "@/components/UserCard";
const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 500);

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);
  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="w-1/2 rounded border p-3 shadow"
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {isError}</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults?.tasks?.length > 0 && (
              <h2>Tasks</h2>
            )}
            {searchResults &&
              searchResults?.tasks?.map((task: any, idx: number) => {
                return <TaskCard key={task.id} task={task} />;
              })}
          </div>
        )}
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {isError}</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.projects && searchResults?.projects?.length > 0 && (
              <h2>Projects</h2>
            )}
            {searchResults &&
              searchResults?.projects?.map((project) => {
                return <ProjectCard key={project.id} project={project} />;
              })}
          </div>
        )}
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {isError}</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.users && searchResults?.users?.length > 0 && (
              <h2>Users</h2>
            )}
            {searchResults &&
              searchResults?.users?.map((user) => {
                return <UserCard key={user.userId} user={user} />;
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
