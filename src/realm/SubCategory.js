export default class {
  static schema = {
    name: "SubCategory",
    primaryKey: "id",
    properties: {
      id: "string",
      title: "string",
      libraryTitle: { type: "string", optional: true },
      iconURL: { type: "string", optional: true },
      hideInLibrary: { type: "bool", default: false },
      sortByName: { type: "bool", default: true },
      isNavigable: { type: "bool", default: false },
      groups: { type: "list", objectType: "Group" },
      media: { type: "list", objectType: "Media" }
    }
  };

  get children() {
    return this.groups;
  }
}
