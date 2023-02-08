import React from "react";
import { Navigate, Outlet, Routes } from "react-router-dom";
import { isLoggedInAtom, user } from "../atoms/status";

import useAuthentication from "../hooks/useAuthentication";
import { useAtom } from "jotai";

const RequireAdmin = () => {
  const [userData, setUserData] = useAtom(user);
  const { isAdmin } = useAuthentication();
 
  return (
    <>
      {isAdmin  ? (
        <Outlet />
      ) : (
        <Navigate to={"/"} replace state={{ path: location.pathname }} />
      )}
    </>
  );
};

export default RequireAdmin;
