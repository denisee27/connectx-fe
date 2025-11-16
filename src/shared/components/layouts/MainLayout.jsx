import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

import React from "react";

export const MainLayout = () => {
  return (
    <div className=" flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Puth header here */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
