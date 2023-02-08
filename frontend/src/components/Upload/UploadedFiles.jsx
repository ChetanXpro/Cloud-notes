import { PaperClipOutlined } from "@ant-design/icons";
import { Text, useColorMode } from "@chakra-ui/react";
import React from "react";

const UploadedFiles = ({ fileName, fileSize }) => {
  const { colorMode } = useColorMode();
  return (
    <div className={`w-[20rem] m-2justify-around flex items-center border ${colorMode === 'dark' ? 'border-gray-300':"border-gray-700"} border-dashed   h-8 rounded`}>
      <span
        className={`w-4 ${
          colorMode === "dark" ? "" : "text-black"
        } pl-1 flex items-center`}
      >
        <PaperClipOutlined />
      </span>
      <span className="flex p-2 text-sm  flex-1">
        <Text>
          {fileName?.length > 25 ? `${fileName?.slice(0, 25)}..` : fileName}
        </Text>
      </span>
      <span className="w-24 text-sm">
        <Text>{fileSize}</Text>
      </span>
    </div>
  );
};

export default UploadedFiles;
