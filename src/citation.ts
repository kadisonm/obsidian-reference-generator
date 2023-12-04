import { requestUrl } from 'obsidian';
const CSL = require('citeproc');

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

    citationData: {};

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

    getCitationInStyle(style: string): string {
        var citations = {};

        // var itemIDs = [];

        // const style = requestUrl('https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl');

        // const citeproc = new CSL.Engine(sys, style, lang, forceLang);

        // const engine = new CSL.Engine(
        //     {
        //       retrieveLocale: (id: string) => {
        //         return langCache.get(id);
        //       },
        //       retrieveItem: (id: string) => {
        //         return bibCache.get(id);
        //       },
        //     },
        //     styleXML,
        //     lang
        // );

            // var xhr = new XMLHttpRequest();
            // xhr.open('GET', 'https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl', false);
            // xhr.send(null);

            // var styleAsText = xhr.responseText;
          

        return "";
    }
}