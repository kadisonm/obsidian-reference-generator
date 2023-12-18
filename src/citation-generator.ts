import { requestSafely, getLocale, getStyle, delay, Author, Citation } from './helpers';
import TurndownService from 'turndown'
import markdownToTxt from 'markdown-to-txt';
import CSL from 'citeproc';

export class CitationGenerator {
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
        const locale = await getLocale();

        if (locale === undefined) {
            return;
        }

        const sys = {
            retrieveLocale: (lang: string) => {
                return locale;
            },

            retrieveItem: (id: number) => {
                return this.citations[id];
            },
        };

        const style = await getStyle(this.style);

        if (style === undefined) {
            return;
        }

        this.engine = new CSL.Engine(sys, style);

        return true;
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
            const turndownService = new TurndownService();

            if (format === "html") {
                newBibliography.push(bibliography[i]);
            } else if(format === "markdown") {
                const markdown = turndownService.turndown(bibliography[i]);
                newBibliography.push(markdown);
            } else if(format === "plaintext") {
                const markdown = turndownService.turndown(bibliography[i]);
                newBibliography.push(markdownToTxt(markdown));
            }
        }

        return newBibliography;
    }
}