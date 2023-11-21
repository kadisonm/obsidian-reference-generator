import { requestUrl } from 'obsidian';
import { getDateMethod1, getDateMethod2 } from './getDates';

export const generateReference = async (url: string) => {
    const reference = {
        firstName: "",
        lastName: "",
        published: "",
        title: "",
        siteName: "",
        link: url
    };

    const result = await requestUrl(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.text, "text/html");

    // Author, date published. Title. [online] website name. Available at: URL.
    // If no author then use site name.

    //reference.firstName = + ". ";
    //reference.lastName = + ", ";
    //reference.published = "(" + __ + ").";
    
    // Authors

    // Date published
    // Class: date-created, 
    // Tag: Time
    // Time Datetime
    // Look for div containing _dateline
    // No date: (n.d.)

    // Get the publication Date
    reference.published = getPublicationDate(doc);

    // Get the page title
    reference.title = getTitle(doc);
    
    // Get the site name
    reference.siteName = getSiteName(url);

    let referenceString = `${reference.lastName}${reference.firstName}${reference.published}${reference.title}[online] ${reference.siteName}Available at: ${reference.link}`;

    return referenceString;
}

function getPublicationDate(doc : Document) : string { 
    let result1 = getDateMethod1(doc);

    if (result1 != "")
        return "(" + result1 + "). ";

    let result2 = getDateMethod2(doc);

    if (result1 != "")
        return "(" + result2 + "). ";

    return "";
}

function getTitle(doc : Document) : string {
    let title = "";

    if (doc.title != "") {
        title = doc.title;
        title = title.split('|')[0]
        title = title.trim();
        title += ". "
    }
  
    return title;
}

function getSiteName(url : string) : string {
    let domainName = new URL(url).hostname;

    if (domainName != "") {
        domainName = domainName.replace(/^www\./, '');
        domainName = domainName.replace(/\.[^.]+$/, '');
        domainName = domainName.charAt(0).toUpperCase() + domainName.slice(1);   
        domainName += ". "; 
    }
    
    return domainName;
}
