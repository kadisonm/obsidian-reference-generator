import { requestUrl, Notice, RequestUrlParam } from "obsidian";

export async function requestSafely(request: string | RequestUrlParam, rawUrl?: string) {
  try {
      return await requestUrl(request);
  }
  catch {
      if (rawUrl) {
          new Notice("Error: Could not connect to " + rawUrl);
      }
      
      return;
  }
}

export function isUrl(url : string) {
  try {
    new URL(url);
    return true;
  } 
  catch (err) {
    return false;
  }
}

export async function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}