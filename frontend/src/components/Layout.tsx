import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <footer>@WhiteCanvas 2024</footer> */}
    </>
  );
};
