import { Text, Button as CButton, Divider } from "@chakra-ui/react";
import React, { useReducer, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import usePrivateApis from "../../hooks/usePrivateApis";

import { Empty } from "antd";
import Folder from "./Folder";

import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import Favourite from "./Favourite";
const Profile = () => {
  const { getCollection, collection } = usePrivateApis();
  // const [selectedArea, , setSelectedArea] = useState("folder");
  const selectedArea = useRef("folder");
  const queryClient = useQueryClient();
  const [render, setRender] = useState(true);

  const { isLoading, isError, data, error, refetch, isSuccess } = useQuery(
    "collection",
    getCollection
  );

  const refetchData = () => refetch();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const setFav = () => {
    // setSelectedArea('favourite')
    selectedArea.current = "favourite";
    
  };

  const setFolder = () => {
    selectedArea.current = "folder";
  };


  return (
    <div className="flex flex-col relative  items-center">
      <div className="flex absolute flex-col  top-2 justify-center w-full items-end">
        <div className="flex  gap-20 top-2 justify-center w-full mb-2  items-center">
          <Text
            cursor={"pointer"}
            border="1px"
            w={"40"}
            // borderBottom={"none"}
            onClick={() => {
              selectedArea.current = "folder";
              setRender(!render);
            }}
            borderColor={"ButtonFace"}
            textAlign="center"
            fontSize={"2xl"}
            className={`font-sans rounded ${
              selectedArea.current === "folder" ? "bg-slate-800" : ""
            }`}
          >
            Your Folders
          </Text>

          <Text
            onClick={() => {
              selectedArea.current = "favourite";
              setRender(!render);
            }}
            cursor={"pointer"}
            rounded
            w={"40"}
            border="1px"
            // borderBottom={"none"}
            borderColor={"ButtonFace"}
            textAlign="center"
            fontSize={"2xl"}
            className={`font-sans rounded  ${
              selectedArea.current === "favourite" ? "bg-slate-800" : ""
            } `}
          >
            Favourite
          </Text>
        </div>
        <Divider />
      </div>

      {selectedArea.current === "folder" ? (
        <div className="flex items-center   w-full justify-center mt-14 lg:ml-6 md:ml-14 xl:ml-6 lg:p-4 lg:justify-start md:justify-start xl:justify-start flex-wrap md:mt-14 lg:mt-14 xl:mt-12 ">
          {data.arr && data.arr.length > 0 ? (
            data.arr.map((i) => (
              <Folder
                key={i.id}
                id={i.id}
                name={i.label}
                totalitemsInside={i.totalNotesInside}
                re={refetchData}
              />
            ))
          ) : (
            <div className="h-full w-full flex mt-30  items-center  justify-center">
              <Empty
                className=""
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 170,
                }}
                description={
                  <Text fontFamily={"fantasy"} fontSize="2xl">
                    You dont have any Folders
                  </Text>
                }
              >
                <CButton
                  width={"40"}
                  mt={"5"}
                  onClick={() => {
                    navigate("/upload");
                  }}
                  colorScheme="blue"
                >
                  Create folder
                </CButton>
              </Empty>
            </div>
          )}
        </div>
      ) : (
        // <div className="flex items-center   w-full justify-center mt-14 lg:ml-6 md:ml-14 xl:ml-6 lg:p-4 lg:justify-start md:justify-start xl:justify-start flex-wrap md:mt-14 lg:mt-14 xl:mt-12 ">
          <Favourite />
        // </div>
      )}
    </div>
  );
};

export default Profile;
