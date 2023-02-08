import { Text, Button as CButton, Divider } from "@chakra-ui/react";
import { Empty } from "antd";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import usePrivateApis from "../../hooks/usePrivateApis";
import Loader from "../Loader/Loader";
import NotesCard from "../PublicNotes/NoteCard";

const Favourite = () => {
  const { getFavList, removeFav } = usePrivateApis();
  const { isLoading, isError, data, error, refetch, isSuccess } = useQuery(
    "favourite",
    getFavList
  );
  const queryClient = useQueryClient();

  const { data: d, mutate } = useMutation(removeFav, {
    onSuccess: () => {
      queryClient.invalidateQueries("favourite");
      refetch();
    },
  });

  const removeFromFav = async (id) => {
    await mutate(id);
  };

  if (isLoading) return <Loader />;
 
  return (
    <div className="flex items-center   w-full justify-center mt-8 lg:ml-6 md:ml-14 xl:ml-6 lg:p-4 lg:justify-start md:justify-start xl:justify-start flex-wrap md:mt-14 lg:mt-14 xl:mt-12 ">
      {data.favlist && data.favlist.length > 0 ? (
        data.favlist.map((i) => (
          <NotesCard
            key={i._id}
            id={i._id}
            name={i.name}
            url={i.url}
            size={i.size}
            removeFromFav={removeFromFav}
            isAlreadyFavourite={true}
          />
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
                You dont have any Favourite
              </Text>
            }
          ></Empty>
        </div>
      )}
    </div>
  );
};

export default Favourite;
