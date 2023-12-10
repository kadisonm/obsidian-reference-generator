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

export function clamp(num: number, min: number, max:number) {
    return Math.min(Math.max(num, min), max);
}

export async function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}