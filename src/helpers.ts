import { requestUrl, Notice, RequestUrlParam, htmlToMarkdown } from "obsidian";

export interface Citation {
  "id": number,
  "type": string,
  "title"?: string,
  "container-title"?: string,
  "URL": string,
  "author"?: Array<Author>,
  "issued"?: {
      "date-parts": [[number, number, number]],
  },
  "accessed"?: {
      "date-parts": [[number, number, number]],
  }
};

export interface Author {
  "given"?: string, 
  "family"?: string
}

// to make citation-generator.ts jest testable
export function getHtmlToMarkdown(html: string | HTMLElement | Document | DocumentFragment) {
  return htmlToMarkdown(html);
}

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

export async function getLocale() {
  const result = await requestSafely('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-en-US.xml');

  if (result === undefined) {
      return;
  }

  return result.text;
}

export async function getStyle(style: string) {
  const result = await requestSafely('https://raw.githubusercontent.com/citation-style-language/styles/master/' + style + '.csl');
  
  if (result === undefined) {
      return;
  }

  return result.text;
}

export async function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}