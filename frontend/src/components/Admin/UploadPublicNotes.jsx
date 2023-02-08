import { Heading } from "@chakra-ui/react";
import { Select } from "antd";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  getUniversityDetails,
  getUniversityList,
  searchNotes,
} from "../../Api/api";
import usePrivateApis from "../../hooks/usePrivateApis";

import { nanoid } from "nanoid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


import {
  useToast,
  Button as CButton,
  Divider as CDivider,
  Text,
  useColorMode,
  
} from "@chakra-ui/react";

import { CloudUploadOutlined, SearchOutlined } from "@ant-design/icons";

import useAzureblob from "../../hooks/useAzureblob";
import UploadedFiles from "../Upload/UploadedFiles";

const UploadPublicNotes = () => {
  const { publicContainerClient } = useAzureblob();
  const [files, setFiles] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const apiPrivateInstance = useAxiosPrivate();
  const [selectedUniversity, setSelectedUniversity] = useState("");
 
  const [selectedSubject, setSelectedSubject] = useState("");
  const { addFav } = usePrivateApis();
  const toast = useToast({ position: "top" });
  const { data: universityList } = useQuery(
    "universityList",
    getUniversityList
  );
  const { colorMode, toggleColorMode } = useColorMode();

  const SendFiles = async (file) => {
    try {
      const uniqueId = nanoid();
      const ext = file.name.slice(-5);

      // Rename file
      const nameChanged = new File([file], `${file.name}--${uniqueId}${ext}`);

      const blockBlobClient = publicContainerClient.getBlockBlobClient(
        nameChanged.name
      );

      const azurePromise = await blockBlobClient.uploadBrowserData(nameChanged);

      // const apiCallPromise = await apiPrivateInstance.post("/note", {
      //   collectionName: selectedCollection,
      //   noteName: file.name,
      //   url: `https://duweb.blob.core.windows.net/pdf/${nameChanged.name}`,
      //   blobName: nameChanged.name,
      //   fileSize: file.size,
      // });

      const apiCallPromise = await apiPrivateInstance.post(`/admin/addnote`, {
        university: selectedUniversity,
      
        subject: selectedSubject,
        name: file.name,
        url: `https://duweb.blob.core.windows.net/public/${nameChanged.name}`,
        fileSize: file.size,
      });

      if (apiCallPromise.status === 200) {
        toast({
          title: `${file.name} Uploaded successfuly`,

          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: `Something went wrong`,

          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }

      setFiles([]);

      setFileData([]);
      setUploadLoading(false);
    } catch (error) {
      console.log(error);
      setUploadLoading(false);
      toast({
        title: "Files not uploaded",

        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const uploadFiles = async () => {
    try {
      const dbData = [];

      if (
        !selectedUniversity ||
       
        !selectedSubject
      )
        return toast({
          title: "Please select a folder to upload files",

          status: "error",
          duration: 2000,
          isClosable: true,
        });

      if (!files?.length > 0) {
        return toast({
          title: "Please select files",

          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }

      const promises = [];

      // lOOP OVER MULTIPLE INPUT FILE
      setUploadLoading(true);
      for (const file of files) {
        promises.push(SendFiles(file));
      }

      const nestedPromises = await Promise.allSettled(promises);
      setUploadLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    document.getElementById("selected").click();
  };

  const { data, mutate, isLoading } = useMutation(getUniversityDetails);
  const {
    data: foundNotes,
    mutate: search,
    isLoading: searchingNotes,
  } = useMutation(searchNotes);

  const { mutate: add } = useMutation(addFav);

  const handleSelected = (value) => {
    setSelectedUniversity(value);
    mutate(value);
  };
  const handleSearch = () => {
    const payload = {
      selectedUniversity,

      selectedSubject,
    };
    search(payload);
  };

  // const addtoFav = async (id) => {
  //   console.log("Called");
  //   add(id);
  // };
  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Heading mt={"2"}>Search Your Notes</Heading>
      </div>
      <div className=" flex flex-col md:flex-row lg:flex-row items-center mt-6 gap-6 justify-center">
        <div>
          <Text>1. Search your University</Text>
          <Select
            showSearch
            onSelect={handleSelected}
            style={{
              width: 200,
            }}
            placeholder="Search University"
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option.label.toLowerCase().includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={universityList}
          />
        </div>
       
       
        <div>
          <Text>2. Search your Subject</Text>
          <Select
            showSearch
            onSelect={(value) => setSelectedSubject(value)}
            style={{
              width: 200,
            }}
            placeholder="Search your subject"
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option.label.toLowerCase().includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={data?.subject}
          />
        </div>
      </div>

      <div className="flex font-sans flex-1 items-center  flex-col mt-10  ">
        <div className="flex flex-col  gap-4 lg:gap-10 items-center">
          <div className="">
            <input
              id="selected"
              accept="image/*,.pdf,.txt,.doc,.docx"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                // console.log(e.target.files)
                const fil = e.target.files;
                let filesData = [];
                for (const file of fil) {
                  function formatBytes(bytes, decimals = 2) {
                    if (!+bytes) return "0 Bytes";

                    const k = 1024;
                    const dm = decimals < 0 ? 0 : decimals;
                    const sizes = [
                      "Bytes",
                      "KB",
                      "MB",
                      "GB",
                      "TB",
                      "PB",
                      "EB",
                      "ZB",
                      "YB",
                    ];

                    const i = Math.floor(Math.log(bytes) / Math.log(k));

                    return `${parseFloat(
                      (bytes / Math.pow(k, i)).toFixed(dm)
                    )} ${sizes[i]}`;
                  }
                  const size = formatBytes(file.size);

                  filesData.push({
                    name: file.name,
                    size,
                    key: file.lastModified,
                  });

                  setFileData(() => {
                    return [...filesData];
                  });
                }
                setFiles(e.target.files);
              }}
              type="file"
              name=""
            />
          </div>
          <div>
            <div
              onClick={handleClick}
              className={`h-[8rem] cursor-pointer w-[16rem] border-2 flex items-center text-center justify-center  border-dashed ${
                colorMode === "dark" ? "border-gray-400" : "border-gray-600"
              }`}
            >
              <SearchOutlined />
              <Text ml={"1.5"}>Browse files</Text>
            </div>
            <Text fontSize={"x-small"} mt={"1"}>
              Only pdf, doc, docx , txt and image files are accepted
            </Text>
          </div>
          <div className="">
            <CButton
              w={"32"}
              leftIcon={<CloudUploadOutlined />}
              onClick={uploadFiles}
              loadingText="Uploading.."
              isLoading={uploadLoading}
              colorScheme="blue"
            >
              Upload
            </CButton>
          </div>
        </div>
        <div className="mt-4 w-full  items-center flex flex-col  gap-2 justify-start">
          {fileData &&
            fileData.map((item) => (
              <UploadedFiles
                key={item.key}
                fileName={item.name}
                fileSize={item.size}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
("pending appoval");
export default UploadPublicNotes;
