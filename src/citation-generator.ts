import { requestUrl, Notice, RequestUrlParam } from 'obsidian';
import TurndownService from 'turndown'
import CSL from 'citeproc';
import { delay } from './helpers';

interface Citation {
    "id": number,
    "type": string,
    "title"?: string,
    "container-title"?: string,
    "URL": string,
    "author"?: Array<Author>,
    "issued"?: {
        "date-parts": [[number, number, number]],
    },
    "accessed"?: {
        "date-parts": [[number, number, number]],
    }
};

interface Author {
    "given"?: string, 
    "family"?: string
}

async function requestSafely(request: string | RequestUrlParam, rawUrl?: string) {
    try {
        return await requestUrl(request);
    }
    catch {
        if (rawUrl) {
            new Notice("Error: Could not connect to " + rawUrl);
        }
        
        return;
    }
}

export default class CitationGenerator {
    citations: Array<Citation>;
    citationIDs: Array<Number>
    engine: any;
    style: string;
    locale: string;
    showAccessed: boolean;
    lastCalled: Date;

    constructor(style: string, showAccessed: boolean) {
		this.style = style;
        this.showAccessed = showAccessed;

        this.citations = new Array();
        this.citationIDs = new Array();
        this.lastCalled = new Date();
	}

    async createEngine() {
        const locale = await requestSafely('https://raw.githubusercontent.com/citation-style-language/locales/master/locales-en-US.xml');

        if (locale === undefined) {
            new Notice("Error: Could not get locale.");
            return;
        }

        const sys = {
            retrieveLocale: (lang: string) => {
                return locale.text;
            },

            retrieveItem: (id: number) => {
                return this.citations[id];
            },
        };
        const styleResponse = await requestSafely('https://raw.githubusercontent.com/citation-style-language/styles/master/' + this.style + '.csl');

        if (styleResponse === undefined) {
            new Notice("Error: Could not get style " + this.style);
            return;
        }

        const style = styleResponse.text;

        this.engine = new CSL.Engine(sys, style);
    }

    async addCitation(url: string) {
        // Make sure API can only be called at 1rps
        const timeDifference = new Date().valueOf() - this.lastCalled.valueOf();
        const waitTime = timeDifference <= 1000 ? 1000 - timeDifference : 0;

        await delay(waitTime);

        this.lastCalled = new Date();

        // Get citation data from Citoid API

        const escapedURL = encodeURIComponent(url);

        const response = await requestSafely({
            url: "https://en.wikipedia.org/api/rest_v1/data/citation/zotero/" + escapedURL,
            headers: { 'Api-User-Agent': 'Reference-Generator/1.0 (https://github.com/kadisonm/obsidian-reference-generator; kadisonmcl@gmail.com)' }
        }, url)

        if (response === undefined) {
            return;
        }

        const responseJson = JSON.parse(response.text)[0];

        // Create CSL format JSON data from response

        const citation: Citation = {
            "id": this.citations.length,
            "type": "webpage",
            "URL": url,
        };

        if (responseJson.title) {
            citation.title = responseJson.title;
        }

        if (responseJson.websiteName) {
            citation["container-title"] = responseJson.websiteName;
        }

        if (responseJson.creators) {
            citation.author = new Array();

            for (let i = 0; i < responseJson.creators.length; i++) {
                const creator = responseJson.creators[i];
        
                const author: Author = {}
        
                if (creator.firstName) {
                    author.given = creator.firstName;
                }
        
                if (creator.lastName) {
                    author.family = creator.lastName;
                }

                citation.author.push(author); 
            }   
        }

        if (responseJson.date) {
            const date = new Date(responseJson.date);
    
            citation["issued"] = {
                "date-parts": [[ date.getFullYear(), date.getMonth(), date.getDate() ]]
            };
        }
    
        if (this.showAccessed) {
            const accessed = new Date();
    
            citation["accessed"] = {
                "date-parts": [[ accessed.getFullYear(), accessed.getMonth(), accessed.getDate() ]]
            };
        }

        this.citations[citation.id] = citation;
        this.citationIDs.push(citation.id);

        return true;
    }

    async getBibliography(sort: boolean) {
        if (this.engine === undefined || this.citations === undefined) {
            return;
        }

        this.engine.updateItems(this.citationIDs); 
        const bibliography = this.engine.makeBibliography()[1];

        if (sort === false && bibliography.length > 1) {
            const unsortedBibliography = new Array();

            for (let i = 0; i < this.citations.length; i++) {
                for (let index = 0; index < bibliography.length; index++) {
                    const citationData = this.citations[i];
                    const bibCitation = bibliography[index];
                    const foundURLs = bibCitation.includes(citationData.URL);

                    if (foundURLs) {
                        unsortedBibliography[i] = bibCitation;
                    }
                }
            } 

            return unsortedBibliography;
        }

        return bibliography;
    }

    async getBibliographyInFormat(bibliography: any, format: string) {
        const newBibliography = new Array();

        for (let i = 0; i < bibliography.length; i++) {
            const citation = bibliography[i];

            if (format === "html") {
                newBibliography.push(citation);
            } else if(format === "markdown") {
                const turndownService = new TurndownService()
                newBibliography.push(turndownService.turndown(citation));
            } else if(format === "plaintext") {
                newBibliography.push(citation.replace(/<[^>]+>/g, ''));
            }
        }

        return newBibliography;
    }
}