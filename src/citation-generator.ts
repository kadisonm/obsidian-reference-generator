import { requestSafely, getLocale, getStyle, Author, Citation } from './helpers';
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

    constructor(style: string, showAccessed: boolean) {
		this.style = style;
        this.showAccessed = showAccessed;

        this.citations = new Array();
        this.citationIDs = new Array();
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

    async addCitation(url: string, lastCalled: number) {
        // Make sure API can only be called at 1rps
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastCalled

        if (timeDifference <= 1000) {
            await sleep(1000 - timeDifference);

        }

        // Get citation data from Citoid API
        const escapedURL = encodeURIComponent(url);

        const response = await requestSafely({
            url: "https://en.wikipedia.org/api/rest_v1/data/citation/zotero/" + escapedURL,
            headers: { 'Api-User-Agent': 'Reference-Generator/1.0 (https://github.com/kadisonm/obsidian-reference-generator; kadisonmcl@gmail.com)' }
        }, url)

        if (response === undefined) {
            return;
        }

        const responseJson = response.json[0];

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
                "date-parts": [[ date.getFullYear(), date.getMonth() + 1, date.getDate() ]]
            };
        }
    
        if (this.showAccessed) {
            const accessed = new Date();
    
            citation["accessed"] = {
                "date-parts": [[ accessed.getFullYear(), accessed.getMonth() + 1, accessed.getDate() ]]
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
        
        const bibliographyResult = this.engine.makeBibliography();
        const bibliographyOrder = bibliographyResult[0].entry_ids;
        const bibliography = bibliographyResult[1];

        if (sort === false && bibliography.length > 1) {
            const unsortedBibliography = new Array();

            for (let i = 0; i < bibliography.length; i++) {
                const originalIndex = bibliographyOrder[i];

                unsortedBibliography[originalIndex] = bibliography[i];
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