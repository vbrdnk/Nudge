import { useMemo, useState } from "react";
import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { ConversionResult } from "@/types/conversionResult";

export default function Command() {
  const [text, setText] = useState("");

  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  const performConversion = (conversionFn: (input: string) => string, type: string) => {
    try {
      const result: ConversionResult = {
        original: text,
        converted: conversionFn(text),
        type: type,
      };

      // Add new result to the top of the results array
      setConversionResult(result);

      // Optional: Show a success toast
      showToast({
        style: Toast.Style.Success,
        title: `${type} Conversion Successful`,
      });
    } catch (error) {
      // Handle conversion errors
      showToast({
        style: Toast.Style.Failure,
        title: `${type} Conversion Failed`,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const clearResults = () => {
    setConversionResult(null);
    setText("");
  };

  const actions = useMemo(
    () => [
      ...(conversionResult?.converted
        ? [<Action.CopyToClipboard key="copy" title="Copy to Clipboard" content={conversionResult.converted} />]
        : []),
      <Action
        key="json"
        title="Convert Json to Js Object"
        onAction={() =>
          performConversion((input) => {
            return JSON.stringify(input, null, 2)
              .replace(/"([^"]+)":/g, "$1:") // Remove quotes around keys
              .replace(/"/g, "'"); // (Optional) Replace double quotes with single quotes for string values
          }, "JSON to JS Object")
        }
      />,
      <Action
        key="jsobject"
        title="Convert Js Object to Json"
        onAction={() =>
          performConversion((input) => {
            return JSON.stringify(input);
          }, "JSON to JS Object")
        }
      />,
      <Action
        key="fromUnicode"
        title="From Unicode"
        onAction={() =>
          performConversion((input) => {
            return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
          }, "From Unicode")
        }
      />,
      <Action
        key="toUnicode"
        title="To Unicode"
        onAction={() =>
          performConversion((input) => {
            return input
              .split("")
              .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
              .join("");
          }, "To Unicode")
        }
      />,
      <Action
        key="trimStart"
        title="Trim Start"
        onAction={() => performConversion((input) => input.trimStart(), "Trim Start")}
      />,
      <Action
        key="trimEnd"
        title="Trim End"
        onAction={() => performConversion((input) => input.trimEnd(), "Trim End")}
      />,

      <Action key="clear" title="Clear Results" onAction={clearResults} />,
    ],
    [text, conversionResult],
  );

  return (
    <Form actions={<ActionPanel>{actions}</ActionPanel>}>
      <Form.TextArea
        id="input"
        title="Paste you text here"
        placeholder="Enter text for conversion"
        value={text}
        onChange={(value) => setText(value)}
      />
      {conversionResult && (
        <>
          <Form.Description title="Conversion Results" text="Most recent conversion will appear below" />
          <Form.Description title={`${conversionResult.type} Result`} text={conversionResult.converted} />
        </>
      )}
    </Form>
  );
}
