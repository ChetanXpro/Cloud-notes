import { DeleteOutlined } from "@ant-design/icons";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Highlight,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { Popconfirm } from "antd";

import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import folder from "../../assets/folder.ico";

import usePrivateApis from "../../hooks/usePrivateApis";

const Folder = ({ name = "history", totalitemsInside = 0, id, re }) => {
  const { deleteCollection } = usePrivateApis();
  const toast = useToast({ position: "top" });
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <div
      className={`m-2 relative   cursor-pointer ${
        colorMode === "dark"
          ? "hover:bg-gray-900  hover:rounded-md"
          : "hover:bg-gray-300 hover:rounded-md"
      }  md:m-4`}
      onClick={() => {
        navigate(`/profile/${id}`);
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="  absolute right-0 top-0  "
      >
        <Popconfirm
          color={"blue"}
          title="All files inside this folder will deleted"
          description={`Are you sure to delete ${name} Folder `}
          onConfirm={() => {
            deleteCollection(id, re);
            queryClient.invalidateQueries("collection");

            toast({
              title: `${name} Folder Deleted`,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          }}
          // onCancel={cancel}
          okText="Delete"
          cancelText="Cancel"
        >
          <a href="#">
            <Tooltip placement="top" label="Delete" aria-label="A tooltip">
              <IconButton
                size={"sm"}
                colorScheme={"red"}
                icon={<DeleteIcon className="" />}
              />
            </Tooltip>
          </a>
        </Popconfirm>
      </div>

      <div className=" flex flex-col items-center border-gray-300  border rounded-md w-40">
        <div>
          <img height={"100rem"} width="120rem" src={folder} alt="" />
        </div>
        <Divider className="mt-1 bg-slate-400 mb-0" />
        <div className="flex  mb-1 justify-between text-left w-full  h-12 pl-4  flex-col">
          <div className="text-sm capitalize font-sans text-left ">
            <Text className="truncate">{name}</Text>
          </div>
          <div className="text-xs font-sans">
            <Text>
              {`${
                totalitemsInside > 0
                  ? `${totalitemsInside} ${
                      totalitemsInside > 1 ? "files" : "file"
                    } inside`
                  : "Folder is empty"
              } `}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
