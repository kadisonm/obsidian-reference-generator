import { promises as fs } from "fs";
import { CitationGenerator } from "../src/citation-generator"
import { getLocale, getStyle, requestSafely } from "../src/helpers";
import citations from "./data/citations";

jest.mock('../src/helpers', () => ({
    requestSafely: jest.fn(),
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
            const locale = await fs.readFile('./tests/data/locales/en-US.xml', 'utf8');
            const style = await fs.readFile('./tests/data/styles/' + styleId + '.csl', 'utf8'); 
    
            (getLocale as jest.MockedFunction<typeof getLocale>).mockResolvedValueOnce(locale);
            (getStyle as jest.MockedFunction<typeof getStyle>).mockResolvedValueOnce(style);

            const generator = new CitationGenerator('apa', true);
            const result = await generator.createEngine();

            expect(result).toBe(true);
        });    
    });
});