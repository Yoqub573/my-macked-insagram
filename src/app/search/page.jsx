'use client'
import { useUserStore } from "@/store/pages/explore/explorestore";
import React, { useEffect } from "react";

const Search = () => {

  const { users, getUsers } = useUserStore()

  useEffect(() => { getUsers() }, [])

  return <div>
    {users && users?.data.map(e => (
      <p>{e.userName}</p>
    ))}
  </div>;
};

export default Search;
