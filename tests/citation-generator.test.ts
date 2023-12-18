import { promises as fs } from "fs";
import * as citationGeneratorModule from "../src/citation-generator"
import { requestSafely } from "../src/helpers";

jest.mock('../src/helpers', () => ({
    requestSafely: jest.fn(),
}));

describe("CitationGenerator", () => {
    describe("createEngine", () => {
        test("With failed getLocale and getStyle", async () =>  {
            jest.spyOn(citationGeneratorModule, "getLocale").mockResolvedValue(undefined);
            jest.spyOn(citationGeneratorModule, "getStyle").mockResolvedValue(undefined);
    
            const generator = new citationGeneratorModule.CitationGenerator('apa', true);
            await generator.createEngine();
     
            expect(generator.engine).toBe(undefined);
        });

        test("With successful getLocale and getStyle", async () =>  {
            const locale = await fs.readFile('./tests/data/en-US.txt', 'utf8');
            const style = await fs.readFile('./tests/data/apa.txt', 'utf8');

            jest.spyOn(citationGeneratorModule, "getLocale").mockResolvedValue(locale);
            jest.spyOn(citationGeneratorModule, "getStyle").mockResolvedValue(style);
    
            const generator = new citationGeneratorModule.CitationGenerator('apa', true);
            await generator.createEngine();
     
            expect(generator.engine).not.toBeUndefined;
        });
    });
});

// Add citation

// Get bibliography

// Get bibliography in format