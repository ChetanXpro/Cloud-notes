import React from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import usePrivateApis from "../../hooks/usePrivateApis";
import { Text, Button as CButton } from "@chakra-ui/react";

import Notes from "./Notes";
import Loader from "../Loader/Loader";
import { Empty } from "antd";

const NotesPage = () => {
  const { getNotes } = usePrivateApis();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery(["notes", id], getNotes);
  const refetchData = () => refetch();
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center mt-2 lg:ml-6 md:ml-6 xl:ml-6 lg:p-4 lg:justify-start md:justify-start xl:justify-start flex-wrap md:mt-12 lg:mt-6 xl:mt-10 ">
      {data.arr.length > 0 ? (
        data.arr.map((i) => (
          <Notes re={refetchData} key={i.id} id={i.id} name={i.name} size={i.size} url={i.url} />
        ))
      ) : (
        <div className="h-full w-full flex mt-40 lg:mt-4 md:mt-4 xl:mt-4  items-center  justify-center">
          <Empty
            className=""
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 170,
            }}
            description={
              <Text fontFamily={"fantasy"} fontSize="2xl">
                You dont have any File
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
              Upload file
            </CButton>
          </Empty>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
