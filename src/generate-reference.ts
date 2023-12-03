import { requestUrl } from 'obsidian';
import { getAuthors } from './scrapers/authors'; 
import { getPublicationDate } from './scrapers/publication-date';
import { getTitle } from './scrapers/title';
import { getSiteName } from './scrapers/site-name';
    
export async function generateReference(url: string) {
    const reponse = await requestUrl(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(reponse.text, "text/html");

    const data = {
        authors: getAuthors(doc, url),
        published: getPublicationDate(doc),
        title: getTitle(doc),
        siteName: getSiteName(doc, url),
        link: url
    };

    const reference = `${data.authors}${data.published}${data.title}[online] ${data.siteName}Available at: ${data.link}`;

    return reference;
}