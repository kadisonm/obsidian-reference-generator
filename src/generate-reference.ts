import { requestUrl, Notice } from 'obsidian';
import { getAuthors } from './scrapers/authors'; 
import { getPublicationDate } from './scrapers/publication-date';
import { getTitle } from './scrapers/title';
import { getSiteName } from './scrapers/site-name';
import CSL from 'citeproc';

export interface Author {
    "family"?: string;
    "given"?: string;
};

interface Citation {
    "id": string;
    "type": string;
    "title": string;
    'container-title': string;
    "URL": string;
    "author": Author[];
    "issued"?: {
        'date-parts': number[][];
    };
    "accessed"?: {
        'date-parts': number[][];
    };
}
    
export async function generateReference(url: string, styleID: string, showAccessed: boolean) {
    const response = await getServer(url);

    if (response === undefined) {
        new Notice("Error: Could not connect to " + url);
        return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(response.text, "text/html");

    // Scrape
    const authors = getAuthors(doc);
    const published = getPublicationDate(doc);
    const title = getTitle(doc);
    const siteName = getSiteName(doc, url);
    const accessed = new Date();

    // Create CSL JSON
    const JSON: Citation = {
        "id": "id",
        "type": "webpage",
        "title": title,
        'container-title': siteName,
        "URL": url,
        "author": authors,
    };

    if (published !== undefined) {
        JSON["issued"] = {
            "date-parts": [[ published.getFullYear(), published.getMonth(), published.getDate() ]]
        }
    }

    if (showAccessed) {
        JSON["accessed"] = {
            "date-parts": [[ accessed.getFullYear(), accessed.getMonth(), accessed.getDate() ]]
        }
    }

    // Create Citeproc Engine
    const locale = await requestUrl('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-en-US.xml'); // Allow changing in settings

    const sys = {
        retrieveLocale: (lang: string) => {
            return locale.text;
        },

        retrieveItem: (id: string) => {
            return JSON;
        },
    };

    const style = await requestUrl('https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl').text;

    const engine = new CSL.Engine(sys, style);

    // Get reference in style
    engine.updateItems(['id']);

    const result = engine.makeBibliography();

    if (result[1]) {
        const text = result[1].toString();

        return text.trim(); 
    }

    return;
}

async function getServer(url: string) {
    try {
        const result = await requestUrl(url);

        return result;
    }
    catch {
        return;
    }
}