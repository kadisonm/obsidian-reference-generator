import { requestUrl } from "obsidian";

export function isUrl(url : string) {
    try {
      new URL(url);
      return true;
    } 
    catch (err) {
      return false;
    }
}