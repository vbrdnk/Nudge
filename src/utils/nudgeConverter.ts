export class NudgeConverter {
  private static URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  static jsonToJsObject(input: string): string {
    try {
      const parsedObject = JSON.parse(input.replace(/"__undefined__"/g, "undefined"));

      const convertToJsObject = (obj: unknown): string => {
        if (obj === undefined) {
          return "undefined";
        }

        if (obj === null) {
          return "null";
        }

        if (typeof obj === "string") {
          // Escape quotes and handle special characters
          const escaped = obj
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
          return `"${escaped}"`;
        }

        if (typeof obj !== "object") {
          return String(obj);
        }

        if (Array.isArray(obj)) {
          return `[${obj.map(convertToJsObject).join(", ")}]`;
        }

        const entries = Object.entries(obj).map(([key, value]) => {
          const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : convertToJsObject(key);
          return `${formattedKey}: ${convertToJsObject(value)}`;
        });

        return `{ ${entries.join(", ")} }`;
      };

      return convertToJsObject(parsedObject);
    } catch (error) {
      throw new Error(`Invalid JSON input: ${(error as Error).message}`);
    }
  }

  static jsObjectToJson(input: string): string {
    try {
      // Replace undefined with a placeholder
      const normalizedInput = input.replace(/\bundefined\b/g, '"__undefined__"');

      // Convert property names that are valid identifiers to quoted strings
      const quotedProps = normalizedInput.replace(/(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)(?=\s*:)/g, '"$1"');

      // Evaluate the string to get an actual object
      // Using Function instead of eval for better scoping
      const obj = new Function(`return ${quotedProps}`)();

      // Convert to JSON, removing the undefined placeholders
      return JSON.stringify(obj).replace(/"__undefined__"/g, "null");
    } catch (error) {
      throw new Error(`Invalid JavaScript object literal: ${(error as Error).message}`);
    }
  }

  static fromUnicode(input: string): string {
    return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  }

  static toUnicode(input: string): string {
    return input
      .split("")
      .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
      .join("");
  }

  static trim(input: string): string {
    return input.trim();
  }

  static encodeUrl(input: string): string {
    const trimmedInput = input.trim();

    //Validate the input
    if (!this.isValidUrl(trimmedInput)) {
      throw new Error("Invalid URL format");
    }

    return encodeURIComponent(trimmedInput);
  }

  static decodeUrl(input: string): string {
    // Validate encoded URL
    try {
      const decoded = decodeURIComponent(input);

      // Optional: Validate decoded URL
      if (input !== encodeURIComponent(decoded)) {
        throw new Error("Invalid URL encoding");
      }

      return decoded;
    } catch (error) {
      throw new Error("Invalid URL encoding");
    }
  }

  private static isValidUrl(input: string): boolean {
    // Check against regex
    if (this.URL_REGEX.test(input)) return true;

    // Additional Checks
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }
}
