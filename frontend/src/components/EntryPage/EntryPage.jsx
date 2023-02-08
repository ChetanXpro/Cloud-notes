import { Button, Spinner, Text, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
// import { getUser } from "../Api/api";
import img from "../../assets/boon.png";

const EntryPage = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col bg-orange-400 sm:flex-row md:flex-row lg:flex-row xl:flex-row   h-full w-full items-center gap-3 ">
      <div className="mt-8 flex flex-col items-center justify-center mb-6 flex-1">
        <Text className="text-4xl md:text-4xl lg:text-6xl mb-3   font-sans text-center flex-1">
          Store Your Notes
        </Text>
        <Text className="font-sans text-center mb-6">
          Soon more features will be available
        </Text>
        {/* <Button onClick={() => navigate("/upload")}>Get Started</Button> */}
        <button className="cssbuttons-io-button">
          Get started
          <div className="iconn">
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </button>
      </div>
      <div className=" items-center justify-end  flex-1 ">
        <div className="mt-8 ">
          <img
            className="rounded-[30%]"
            height={"400px"}
            width="400px"
            src={img}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
