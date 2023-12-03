import { getMetaData, isUrl } from "../helpers";
import { Author } from "src/citation";

export function getAuthors(doc: Document): Array<Author> {
    let meta = getMetaData(doc, "author");
    
    if (meta.length == 0)
        meta = getMetaData(doc, "creator");

    let authors = new Array();
    
    for (let i = 0; i < meta.length; i++) {
        const value = meta[i];

        //Make sure author is not a url
        if (isUrl(value))
            continue;

        const authorName = value.split(" ");

        authors.push({
            firstName: authorName[0],
            lastName: authorName[1]
        })

        // if (authorName.length == 1) {
        //     authors += authorName[0] + ". ";
        //     continue;
        // }
            
        // if (authorName[1] !== "")
        //     authors += authorName[1] + ", "

        // if (authorName[0] !== "")
        //    authors += authorName[0] + ". "
    }

    return authors;
}