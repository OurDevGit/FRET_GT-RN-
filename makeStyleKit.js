// The right way to do this would be to parse the Java file and find the method signatures that way...

const fs = require("fs");
const path = require("path");
const program = require("commander");

const prefix = "public static void draw";

program
  .version("0.1.0")
  .option("-j --java [com/project/MyStyleKit.java]", "classpath to Java file")
  .option(
    "-s --stylefile [src/components/StyleKit/styleKitComponents.js]",
    "path to save StyleKit file"
  )
  // .option('-o, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

const javaFile = path.join(
  __dirname,
  "android/app/src/main/java",
  program.java
);
const contents = fs.readFileSync(javaFile, "utf-8");

const makeArgs = args => {
  var types = [];
  var vars = [];

  args.forEach(arg => {
    const t = arg.split(" ")[0];
    const v = arg.split(" ")[1];

    if (t !== "Canvas" && t !== "Context") {
      types.push(t);
      vars.push(v);
    }
  });

  return { types, vars };
};

const makeProps = ({ types, vars }) => {
  var props = [];

  for (var i in vars) {
    let t = types[i];
    let v = vars[i];

    var _type = "";

    if (t === "RectF") {
      _type = "{{left:0, top:0, right:10, bottom:10}}";
    } else if (t === "float") {
      _type = "{5.0}";
    } else if (t === "boolean") {
      _type = "{true}";
    } else if (t === "String") {
      _type = `"_some string_"`;
    } else if (t === "ResizingBehavior") {
      _type = "{ResizingBehavior.AspectFit}";
    } else if (t === "PointF") {
      _type = "{{x:0, y:0}}";
    } else {
      console.log(t);
    }

    props.push(`${v}=${_type}`);
  }

  return props;
};

const makeComponent = (drawMethod, { types, vars }) => {
  const drawArgs = vars
    .map(v => {
      return `"${v}"`;
    })
    .join(",");

  const methodSuffix = vars.reduce((prev, curr) => `${prev}_${curr}`, "");

  makeProps({ types, vars });

  const compName = `${drawMethod.substr(4)}${methodSuffix}`;

  return `export const ${compName} = props => <PaintCode
  drawMethod="${drawMethod.substr(4)}"
  drawArgs={[${drawArgs}]}
  {...props}
/>`;
};

const makeFile = components => {
  const comps = `${components.join("\n\n")}`;

  return `import React from "react";
import { PaintCode } from "./lib";

${comps}
`;
};

var i = 1;
var components = [];
const lines = contents.split("\n");
lines.forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine.indexOf("public static void draw") === 0) {
    // console.log(`${i}: ${trimmedLine.substr(prefix.length - 4)}`);
    const pcDrawMethod = trimmedLine
      .split("(")[0]
      .replace("public static void ", "");
    const twixtBananas = trimmedLine.split("(")[1].split(")")[0];
    const args = twixtBananas.split(", ");
    const pcArgs = makeArgs(args);

    const component = makeComponent(pcDrawMethod, pcArgs);
    components.push(component);
  }
  i++;
});

const outFile = makeFile(components);

fs.writeFileSync(path.join(__dirname, program.stylefile), outFile);
