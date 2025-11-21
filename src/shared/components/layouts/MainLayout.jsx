import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

import React from "react";
import NavbarMain from "../../../features/Profiling/pages/NavbarMain";

export const MainLayout = () => {
  return (
    <div>
      <NavbarMain />
      <Outlet />
    </div>
  );
}; 
