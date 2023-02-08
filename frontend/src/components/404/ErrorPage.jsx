import { Button, Text, useColorMode } from "@chakra-ui/react";
import { Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import notFound from "../../assets/404.svg";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  return (
    <div className="h-screen w-[100vw]  flex flex-col items-center font-sans justify-center">
      <div className=" flex flex-col items-center justify-center">
        <img src={notFound} height="35%" width={"35%"} alt="" />
        <Text mt={"6"} mb="4" className="text-lg ">
          Sorry, the page you visited does not exist.
        </Text>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
};

export default ErrorPage;
