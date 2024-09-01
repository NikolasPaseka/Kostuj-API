/**
* Parses a boolean from a string.
* @param str - The string to parse.
* @returns The parsed boolean.
* @throws Will throw an error if the string is not "true" or "false".
*/
export function parseBoolean(str: string): boolean {
 if (str.toLowerCase() === "true") {
   return true;
 } else if (str.toLowerCase() === "false") {
   return false;
 } else {
   throw new Error(`Invalid boolean string: ${str}`);
 }
}