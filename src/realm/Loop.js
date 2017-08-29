export default class {
  static schema = {
    name: "Loop",
    primaryKey: "id",
    properties: {
      id: "string",
      mediaId: { type: "string", optional: false },
      name: { type: "string", optional: true },
      begin: { type: "double", default: -1 },
      end: { type: "double", default: -1 },
      isQuickLoop: { type: "bool", default: false }
    }
  };
}
