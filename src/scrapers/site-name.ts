import { getMetaData, isUrl } from "../helpers";

export function getSiteName(doc : Document, url: string) : string {
    const methods = [method1, method2];

    for (const method of methods) {
        const result = method(doc, url);

        if (result != "") {
          return result + ". ";
        }
    }

    return "";
}

// Methods of finding the site name

const method1 = (doc: Document, url: string) : string => {
    let meta = getMetaData(doc, "og:site_name");
    
    if (meta.length == 0)
        return "";
    
    if (isUrl(meta[0]))
        return ""

    return meta[0]
}

const method2 = (doc: Document, url: string) : string => {
    let domainName = new URL(url).hostname;

    if (domainName != "") {
        domainName = domainName.replace(/^www\./, '');
        domainName = domainName.replace(/\.[^.]+$/, '');
        domainName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
    }

    return domainName;
}