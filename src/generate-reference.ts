import { requestUrl, Notice, RequestUrlParam } from 'obsidian';
import CSL from 'citeproc';

export interface Author {
    "family"?: string;
    "given"?: string;
};

export async function generateReference(url: string, styleID: string, showAccessed: boolean) {
    // Scrape
    const escapedURL = encodeURIComponent(url);

    const response = await requestSafely({
        url: "https://en.wikipedia.org/api/rest_v1/data/citation/zotero/" + escapedURL,
        headers: { 'Api-User-Agent': 'Reference-Generator/1.0 (https://github.com/kadisonm/obsidian-reference-generator; kadisonmcl@gmail.com)' }
    })

    if (response === undefined) {
        new Notice("Error: Could not connect to " + url);
        return;
    }

    const responseJson = JSON.parse(response.text)[0];

    // Create CSL JSON
    const cslSchema = {
        "id": "id",
        "type": "webpage",
        "title": responseJson.title,
        'container-title': responseJson.websiteName,
        "URL": url,
        "author": new Array(),
        "issued": {
        },
        "accessed": {
        }
    };
    
    for (let i = 0; i < responseJson.creators.length; i++) {
        const creator = responseJson.creators[i];

        const author : Author = {};

        if (creator.firstName) {
            author.given = creator.firstName;
        }

        if (creator.lastName) {
            author.family = creator.lastName;
        }

        cslSchema.author.push(author);
    }

    if (responseJson.date) {
        const date = new Date(responseJson.date);

        cslSchema["issued"] = {
            "date-parts": [[ date.getFullYear(), date.getMonth(), date.getDate() ]]
        };
    }

    if (showAccessed) {
        const accessed = new Date();

        cslSchema["accessed"] = {
            "date-parts": [[ accessed.getFullYear(), accessed.getMonth(), accessed.getDate() ]]
        };
    }

    // Create Citeproc Engine
    const locale = await requestSafely('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-en-US.xml'); // Allow changing in settings

    if (locale === undefined) {
        new Notice("Error: Could not get locale at " + url);
        return;
    }

    const sys = {
        retrieveLocale: (lang: string) => {
            return locale.text;
        },

        retrieveItem: (id: string) => {
            return cslSchema;
        },
    };

    const styleResponse = await requestSafely('https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl');

    if (styleResponse === undefined) {
        new Notice("Error: Could not get style at " + url);
        return;
    }

    const style = styleResponse.text;

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

async function requestSafely(request: string | RequestUrlParam) {
    try {
        const result = await requestUrl(request);

        return result;
    }
    catch {
        return;
    }
}