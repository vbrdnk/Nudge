import { NudgeConverter } from "./nudgeConverter";

export type ActionMetadata = {
  action: (input: string) => string;
  title: string;
  // Short description to be used when showing the result
  type: string;
};

export const actions: Array<ActionMetadata> = [
  {
    action: NudgeConverter.jsonToJsObject,
    type: "JSON to JS Object",
    title: "Convert Json to Js Object",
  },
  {
    action: NudgeConverter.jsObjectToJson,
    type: "JS to JSON  Object",
    title: "Convert Js Object to Json",
  },
  {
    action: NudgeConverter.fromUnicode,
    type: "From Unicode",
    title: "From Unicode",
  },
  {
    action: NudgeConverter.toUnicode,
    type: "To Unicode",
    title: "To Unicode",
  },
  {
    action: NudgeConverter.trim,
    type: "Trim Whitespaces",
    title: "Trim",
  },
  {
    action: NudgeConverter.encodeUrl.bind(NudgeConverter),
    type: "Encode URL",
    title: "Encode URL",
  },
  {
    action: NudgeConverter.decodeUrl.bind(NudgeConverter),
    type: "Decode URL",
    title: "Decode URL",
  },
];
