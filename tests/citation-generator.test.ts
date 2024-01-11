import { promises as fs } from "fs";
import { CitationGenerator } from "../src/citation-generator"
import { getLocale, getStyle, requestSafely } from "../src/helpers";
import testCitations from "./test-data/unsorted-citations";

jest.mock('../src/helpers', () => ({
    requestSafely: jest.fn(),
    getHtmlToMarkdown: jest.fn(),
    getLocale: jest.fn(),
    getStyle: jest.fn()
}));

const styleIds = [
    'apa', 
    'modern-language-association', 
    'university-of-york-harvard', 
    'chicago-note-bibliography', 
    'ieee-transactions-on-medical-imaging'
];

describe("createEngine", () => {
    describe("Successful with default styles", () => {
        it.each(styleIds)("%s", async (styleId) =>  {
            const locale = await fs.readFile('./tests/test-data/locales/en-US.xml', 'utf8');
            const style = await fs.readFile('./tests/test-data/styles/' + styleId + '.csl', 'utf8'); 
    
            (getLocale as jest.MockedFunction<typeof getLocale>).mockResolvedValueOnce(locale);
            (getStyle as jest.MockedFunction<typeof getStyle>).mockResolvedValueOnce(style);

            const generator = new CitationGenerator('apa', true);
            const result = await generator.createEngine();

            expect(result).toBe(true);
        });    
    });
});

describe("getBibliography", () => {
    describe("Sorts bibliography correctly", () => {
        it.each([true, false])("Sort enabled: %s", async (sort) =>  {
            const locale = await fs.readFile('./tests/test-data/locales/en-US.xml', 'utf8');
            const style = await fs.readFile('./tests/test-data/styles/apa.csl', 'utf8'); 
    
            (getLocale as jest.MockedFunction<typeof getLocale>).mockResolvedValueOnce(locale);
            (getStyle as jest.MockedFunction<typeof getStyle>).mockResolvedValueOnce(style);

            const generator = new CitationGenerator('apa', true);
            const result = await generator.createEngine();

            generator.citationIDs = sort ? [0, 1] : [1, 0];
            generator.citations = testCitations;

            const bibliography = await generator.getBibliography(sort);

            // Checks if the first citation's title is 1 and not 2 (means it is sorted)
            const foundInFirst = bibliography[0].includes("1");

            // If the bibliography was sorted it should match the passed in sorted setting
            expect(foundInFirst).toBe(sort); 
        });
    });
});