import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useAzureblob from "./useAzureblob";

const usePrivateApis = () => {
  const apiPrivateInstance = useAxiosPrivate();
  const { pdfContainerClient } = useAzureblob();
  const toast = useToast({ position: "top" });

  const getCollection = async () => {
    try {
      const request = await apiPrivateInstance.get("/note/collection");

      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };
  const getNotes = async ({ queryKey }) => {
    try {
      const [key, id] = queryKey;
      const collectionID = id;

      const request = await apiPrivateInstance.get(
        `/note?collectionID=${collectionID}`
      );

      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };

  const deleteCollection = async (id, re) => {
    try {
      const collectionID = id;

      const request = await apiPrivateInstance.delete(
        `/note/collection?collectionID=${collectionID}`
      );
      re();
      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };
  const deleteNote = async (id, re) => {
    try {
      const request = await apiPrivateInstance.delete(`/note/?noteID=${id}`);
      re();

      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };
  const addFav = async (noteId) => {
    try {
      const request = await apiPrivateInstance.post(`/public/add`, {
        noteId,
      });
      if (request.status === 400) {
        toast({
          title: `Aready Added in Favourite`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else if (request.status === 200) {
        toast({
          title: `Added in Favourite`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };
  const removeFav = async (id) => {
    try {
      const request = await apiPrivateInstance.post(`/public/deletefavourite`, {
        noteId: id,
      });

      if (request.status === 400) {
        toast({
          title: `Something went wrong`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else if (request.status === 200) {
        toast({
          title: `Removed from Favourite`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }

      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };
  const getFavList = async () => {
    try {
      const request = await apiPrivateInstance.get(`/public/favourite`);

      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };

  const createPublicNotes = async (payload) => {
    try {
      const request = await apiPrivateInstance.get(`/admin/addnote`, {
        university: payload.university,
        course: payload.course,
        semester: payload.semester,
        subject: payload.subject,
        name: payload.name,
        url: payload.url,
        fileSize: payload.fileSize,
      });

      return request?.data;
    } catch (err) {
      const error = err;
      return Promise.reject(error.response);
    }
  };

  return {
    getCollection,
    deleteNote,
    getNotes,
    deleteCollection,
    addFav,
    removeFav,
    getFavList,
  };
};

export default usePrivateApis;
