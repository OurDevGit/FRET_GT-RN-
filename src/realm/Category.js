export default class {
  static schema = {
    name: "Category",
    primaryKey: "id",
    properties: {
      id: "string",
      title: { type: "string", default: "[no title]" },
      libraryTitle: { type: "string", optional: true },
      hideInLibrary: { type: "bool", default: false },
      isClientSided: { type: "bool", default: false },
      isGrouped: { type: "bool", default: false },
      index: { type: "int", default: 0 },
      iconURL: { type: "string", optional: true },
      sortByName: { type: "bool", default: true },
      subCategories: { type: "list", objectType: "SubCategory" },
      media: { type: "list", objectType: "Media" }
    }
  };

  get children() {
    return this.subCategories;
  }

  get iconPath() {
    return this.iconURL;
  }
}
