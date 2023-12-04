import { requestUrl } from 'obsidian';
import { getAuthors } from './scrapers/authors'; 
import { getPublicationDate } from './scrapers/publication-date';
import { getTitle } from './scrapers/title';
import { getSiteName } from './scrapers/site-name';
import { CSL } from 'citeproc';

export interface Author {
    given: string;
    family: string;
}

interface CSLObject {
    id: string;
    type: string;
    title: string;
    'container-title': string;
    URL: string;
    author: Author[];
    issued: {
        'date-parts': number[][];
    };
    accessed?: {
        'date-parts': number[][];
    };
}
    
export async function generateReference(url: string, styleID: string, showAccessed: boolean) {
    const reponse = await requestUrl(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(reponse.text, "text/html");

    // Scrape
    const authors = getAuthors(doc);
    const published = getPublicationDate(doc);
    const title = getTitle(doc);
    const siteName = getSiteName(doc, url);
    const accessed = new Date();

    // Create CSL JSON
    const cslObject: CSLObject = {
        id: "scrapedCitation",
        type: "webpage",
        title: title,
        'container-title': siteName,
        URL: url,
        author: authors,
        issued:{
            'date-parts': [[ published.getFullYear(), published.getMonth(), published.getDate() ]]
        },
    }

    if (showAccessed) {
        cslObject.accessed = {'date-parts': [[ accessed.getFullYear(), accessed.getMonth(), accessed.getDate() ]]}
    }

    // Create Citeproc Engine
    const sys = {
        retrieveLocale: async (langId: string) => {
            try {
                const response = await requestUrl('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-' + langId + '.xml');
                const result = await response.text;
                return result;
            } catch (error) {
                return false;
            }
        },

        retrieveItem: (id: string) => {
            return cslObject;
        },
    };

    const style = requestUrl('https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl');

    const citeproc = new CSL.Engine(sys, style);

    

    return "";

    //const reference = new Citation(authors, published, title, siteName, link, accessed);
    //return reference.getCitationInStyle(style);
}