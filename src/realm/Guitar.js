export default class {
  static schema = {
    name: "Guitar",
    primaryKey: "id",
    properties: {
      id: "string",
      name: { type: "string", optional: true },
      isLefty: { type: "bool", default: false },
      isBass: { type: "bool", default: false }
    }
  };
}
