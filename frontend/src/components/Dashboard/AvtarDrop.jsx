import { Avatar, IconButton, Text, useColorMode } from "@chakra-ui/react";
import { Image, Avatar as Avatarr } from "antd";
import { useAtom } from "jotai";

import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { user } from "../../atoms/status";
import Discord from "../../assets/discord.png";
import WhiteDiscord from "../../assets/whitedis.png";
import logo from "../../assets/nobg.png";
import { Icon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { AntDesignOutlined, CloseOutlined } from "@ant-design/icons";

const AvtarDrop = ({ setAvtarDrop }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [userData, setUser] = useAtom(user);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("jwt");
    navigate("sign_in");
  };

  return (
    <ul
      className={
        "flex-col flex absolute rounded-xl  z-50 items-center top-12 right-1 bottom-0 h-[6rem]   uppercase bg-black/40 backdrop-blur-lg gap-8 justify-center p-8 "
      }
    >
      <Link className="hover:underline w-full h-full" to={"/"}>
        <Text>Settings</Text>
      </Link>

      <Text className="hover:underline cursor-pointer" onClick={logout}>
        Logout
      </Text>
    </ul>
  );
};

export default AvtarDrop;
