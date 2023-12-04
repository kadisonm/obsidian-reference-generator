import { requestUrl } from 'obsidian';
import { getAuthors } from './scrapers/authors'; 
import { getPublicationDate } from './scrapers/publication-date';
import { getTitle } from './scrapers/title';
import { getSiteName } from './scrapers/site-name';
import CSL from 'citeproc';
    
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
    const JSON = [{
        "id": "id",
        "type": "webpage",
        "title": title,
        'container-title': siteName,
        "URL": url,
        "author": authors,
        "issued": {
            'date-parts': [[ published.getFullYear(), published.getMonth(), published.getDate() ]]
        },
    }];

    // Create Citeproc Engine
    const sys = {
        retrieveLocale: async (lang: string) => {
            const response = await requestUrl('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-' + lang + '.xml');
            const result = response.text;

            return result;
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

    console.log(result);

    return "";
}