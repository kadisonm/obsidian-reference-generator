import CSL from 'citeproc';
import { requestSafely } from '../src/citation-generator';

import * as citationGeneratorModule from "../src/citation-generator"

//jest.mock('CSL');
jest.mock('../src/citation-generator', () => ({
    getLocale: jest.fn(() => '01-01-2020'),
}));

describe("CitationGenerator", () => {
    jest.spyOn(citationGeneratorModule, "getLocale").mockResolvedValue('');
    jest.spyOn(citationGeneratorModule, "getStyle").mockResolvedValue('');

    test("Create Engine", async () =>  {
        const generator = new citationGeneratorModule.CitationGenerator('apa', true);
		await generator.createEngine();
 
        expect(generator.engine).not.toBe(undefined);
    });
});

// Add citation

// Get bibliography

// Get bibliography in format