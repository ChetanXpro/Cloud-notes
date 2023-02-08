import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Header";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="">
        {/* <div className="h-[calc(100vh-3rem)]"> */}
        <Outlet />
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
