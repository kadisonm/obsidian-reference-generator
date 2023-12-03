import { requestUrl } from 'obsidian';
import { getAuthors } from './scrapers/authors'; 
import { getPublicationDate } from './scrapers/publication-date';
import { getTitle } from './scrapers/title';
import { getSiteName } from './scrapers/site-name';
import { Citation, ReferenceStyle} from './citation';
    
export async function generateReference(url: string, style: ReferenceStyle, showAccessed: boolean) {
    const reponse = await requestUrl(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(reponse.text, "text/html");

    const authors = getAuthors(doc);
    const published = getPublicationDate(doc);
    const title = getTitle(doc);
    const siteName = getSiteName(doc, url);
    const link = url;
    const accessed = showAccessed ? new Date() : undefined;
    
    const reference = new Citation(authors, published, title, siteName, link, accessed);

    return reference.getCitationInStyle(style);
}