import React from "react";
import Header from "../ui/header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-white">{children}</div>
    </div>
  );
};
export default AppLayout;
