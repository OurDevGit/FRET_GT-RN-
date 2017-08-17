export default class {
  static schema = {
    name: "Group",
    primaryKey: "id",
    properties: {
      id: "string",
      title: { type: "string", default: "[no title]" },
      libraryTitle: { type: "string", optional: true },
      hideInLibrary: { type: "bool", default: false },
      sortByName: { type: "bool", default: true },
      media: { type: "list", objectType: "Media" }
    }
  };
}
