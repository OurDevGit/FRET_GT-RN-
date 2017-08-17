export default class {
  static schema = {
    name: "Pattern",
    primaryKey: "id",
    properties: {
      id: "string",
      index: "int",
      category: { type: "string", optional: true },
      type: { type: "string", optional: true },
      key: { type: "string", optional: true },
      position: { type: "string", optional: true },
      title: { type: "string", optional: true },
      subTitle: { type: "string", optional: true },
      image: { type: "string", optional: true },
      altImage: { type: "string", optional: true },
      chord: { type: "PatternReference", optional: true },
      scale: { type: "PatternReference", optional: true },
      interval: { type: "PatternReference", optional: true },
      root: { type: "PatternRoot", optional: true },
      notes: { type: "list", objectType: "PatternNote" }
    }
  };
}
