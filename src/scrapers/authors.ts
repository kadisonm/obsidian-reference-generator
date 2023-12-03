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

        const checkMultiple = value.split(",");

        if (checkMultiple.length > 0) {
            checkMultiple.forEach((author) => {
                const authorName = author.trim().split(" ");

                console.log(checkMultiple);

                authors.push({
                    firstName: authorName[0],
                    lastName: authorName[1]
                })
            });

            continue;
        }

        const authorName = value.trim().split(" ");

        authors.push({
            firstName: authorName[0],
            lastName: authorName[1]
        })
    }

    return authors;
}