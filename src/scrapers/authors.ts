import { getSiteName } from "./site-name";
import { getMetaData, isUrl } from "../helpers";

export function getAuthors(doc: Document, url: string): string {
    let siteName = getSiteName(doc, url);

    let meta = getMetaData(doc, "author");
    
    if (meta.length == 0)
        meta = getMetaData(doc, "creator");

    let authors = "";
    
    for (let i = 0; i < meta.length; i++) {
        const value = meta[i];

        //Make sure author is not a url
        if (isUrl(value))
            continue;

        const authorName = value.split(" ");

        if (authorName.length == 1) {
            authors += authorName[0] + ". ";
            continue;
        }
            
        if (authorName[1] !== "")
            authors += authorName[1] + ", "

        if (authorName[0] !== "")
           authors += authorName[0] + ". "
    }

    if (authors !== "")
        return authors;
    else
        return siteName;
}