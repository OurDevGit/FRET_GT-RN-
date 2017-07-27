import React from "react";
import { Picker } from "react-native";
import { allChapters } from "./ChapterSelectors";

const ChapterPicker = ({ chapters, currentChapter, onChange }) =>
  <Picker
    selectedValue={currentChapter}
    onValueChange={onChange}
    mode="dropdown"
  >
    {allChapters(chapters).map(chappy =>
      <Picker.Item label={chappy.name} value={chappy} key={chappy.uniqueId} />
    )}
  </Picker>;

export default ChapterPicker;
