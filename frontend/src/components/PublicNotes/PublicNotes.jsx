import { Button, Heading, Text } from "@chakra-ui/react";
import { Select } from "antd";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  getUniversityDetails,
  getUniversityList,
  searchNotes,
} from "../../Api/api";
import usePrivateApis from "../../hooks/usePrivateApis";

import NotesCard from "./NoteCard";

const PublicNotes = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("");
  const { addFav } = usePrivateApis();
  const { data: universityList } = useQuery(
    "universityList",
    getUniversityList
  );

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
        <Heading mt={"2"}>Search Your University Notes</Heading>
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
      <div className="flex items-center justify-center mt-8">
        <Button onClick={handleSearch} isLoading={searchingNotes}>
          Search Notes
        </Button>
      </div>
      <div className="flex flex-wrap">

        {foundNotes && foundNotes.notes.length > 0 ?
          foundNotes.notes.map((n) => (
            <NotesCard
              key={n.id}
              id={n.id}
              name={n.name}
              add={add}
              size={n.size}
              url={n.url}
            />
          )) : <h1 className="flex  fixed top-[50%] left-[50%] -ml-14">Search Public notes</h1>}
      </div>
    </div>
  );
};
("pending appoval");
export default PublicNotes;

{
}
