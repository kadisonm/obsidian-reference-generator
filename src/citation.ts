import { accessSync } from "fs";

export type ReferenceStyle = "Harvard" | "Harvard (Australia)";

export interface Author {
    firstName: string;
    lastName: string;
}

export class Citation {
    authors: Array<Author>;
    published: Date;
    title: string;
    siteName: string;
    link: string;
    accessed: Date;

    constructor(authors? : Array<Author>, published? : Date, title? : string, siteName? : string, link? : string, accessed? : Date) {
        if (authors !== undefined) {
            this.authors = authors;
        }
            
        if (published !== undefined) {
            this.published = published;
        }
        
        if (title !== undefined) {
            this.title = title;
        }
            
        if (siteName !== undefined) {
            this.siteName = siteName;
        }
            
        if (link !== undefined) {
            this.link = link;
        }   
        
        if (accessed !== undefined) {
            this.accessed = accessed;
        }  
    }

    getCitationInStyle(style: ReferenceStyle): string {
        // Last, F. (2000). Title. [online] Site name. Available at: https://www.example.com [Accessed 1 Jan. 2000].
        if (style == "Harvard") {
            // Format accessed
            let accessed = "";

            if (this.accessed !== undefined) {
                const date = this.accessed.toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
                
                accessed = `[Accessed ${date}].`;
            }

            // Format authors
            let authors = "";

            this.authors.forEach((author) => {
                if (author.firstName !== "" && author.lastName === "") {
                    authors += author.firstName + ". ";
                    return;
                }
                        
                if (author.lastName !== "") {
                    authors += author.lastName + ", "
                }

                if (author.firstName !== "") {
                    authors += author.firstName[0] + ". "
                }
            });

            // No authors use site name
            let siteName = this.siteName + ". ";

            if (authors === "") {
                authors = siteName;
                siteName = ""
            }

            // Format published year
            let year = "n.d.";

            if (this.published !== undefined) {
                year = this.published.getFullYear().toString();
            }

            // Format Title
            const lastChar = this.title[this.title.length - 1];

            const format = /[!?]+/;

            let title = this.title;

            if (format.test(lastChar) === false) {
                title += "."
            }

            return `${authors}(${year}). ${title} [online] ${siteName}Available at: ${this.link} ${accessed}`
        }

        // Last, F 2000, Title, Site name, Publisher, viewed 1 January 2000, <https://www.example.com>.
        else if (style == "Harvard (Australia)") {
            // Format accessed
            let accessed = "";

            if (this.accessed !== undefined) {
                accessed = "viewed " + this.accessed.toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }) + ", ";
            }

            // Format authors
            let authors = "";

            this.authors.forEach((author) => {
                if (author.firstName !== "" && author.lastName === "") {
                    authors += author.firstName + " & ";
                    return;
                }
                        
                if (author.lastName !== "") {
                    authors += author.lastName + ", "
                }

                if (author.firstName !== "") {
                    authors += author.firstName[0] + " & "
                }
            });

            // Remove & from last author
            authors = authors.slice(0, -2);

            // Format published year
            let year = "n.d.";

            if (this.published !== undefined) {
                year = this.published.getFullYear().toString();
            }

            // Format Title
            const lastChar = this.title[this.title.length - 1];

            const format = /[!?]+/;

            let title = " " + this.title;

            if (format.test(lastChar) === false) {
                title += ","
            }

            // If no author then title first.
            if (authors === "") {
                authors = this.title + " ";
                title = ""
            }

            return `${authors}${year},${title} ${this.siteName}, ${accessed}<​${this.link}​>`
        }

        return "";
    }
}