import React from "react";
import { Outlet } from "react-router-dom";

const EntryDashboard = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default EntryDashboard;
