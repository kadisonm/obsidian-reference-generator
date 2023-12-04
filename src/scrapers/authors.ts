import { getMetaData, isUrl } from "../helpers";
import { Author } from "src/generate-reference";

export function getAuthors(doc: Document): Author[] {
    let meta = getMetaData(doc, "author");
    
    if (meta.length == 0)
        meta = getMetaData(doc, "creator");

    let authors = new Array();
    
    for (let i = 0; i < meta.length; i++) {
        const value = meta[i];

        //Make sure author is not a url
        if (isUrl(value))
            continue;

        const splitAuthors = value.split(",");

        splitAuthors.forEach((author) => {
            author = author.trim();
            const authorName = author.split(" ");

            authors.push({
                family: authorName[0],
                given: authorName[1]
            })
        });
    }

    return authors;
}