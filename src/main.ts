import { Editor, Notice, MarkdownView, Plugin, Platform } from 'obsidian';
import { SettingsTab, ReferenceGeneratorSettings, DEFAULT_SETTINGS } from "./settings";
import { SuggestStyleModal } from './suggest-modal'; 
import { CitationGenerator } from './citation-generator';
import { cslList } from "./csl/csl-list";
import { isUrl } from './helpers';

const defaultLogo = "file-text";
const selectLogo = "scan";

export default class ReferenceGeneratorPlugin extends Plugin {
	settings: ReferenceGeneratorSettings;
	lastGenerationTime: Date;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		this.lastGenerationTime = new Date();

		// Default Style Command
		this.addCommand({
			id: 'generate-reference-default',
			name: 'Generate reference (default style)',
			icon: defaultLogo,
			
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				if (selection.length > 0) {
					this.replaceLinks(editor, selection, true, this.settings.currentStyle);
				}
			},
		});
		
		// Selectable Style Command
		this.addCommand({
			id: 'generate-reference-selected',
			name: 'Generate reference (select style)',
			icon: selectLogo,
			
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();

				if (selection.length > 0) {
					this.generateFromSuggestionModal(editor, selection, true)
				}
			},
		});

		// Context Menu Items
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				const selection = editor.getSelection();

				if (selection.length > 0) { // Link(s) selected
					if (this.settings.showDefaultContext) {
						menu.addItem((item) => {
							item
							.setTitle("Generate reference (default style)")
							.setIcon(defaultLogo)
							.onClick(async () => this.replaceLinks(editor, selection, true, this.settings.currentStyle))
						});	
					}
					
					if (this.settings.showSelectContext) {
						menu.addItem((item) => {
							item
							.setTitle("Generate reference (select style)")
							.setIcon(selectLogo)
							.onClick(async () => this.generateFromSuggestionModal(editor, selection, true))
						})	
					}	
				} else { // Link right clicked
					const text = editor.getLine(editor.getCursor("from").line);

					if (isUrl(text)) {
						if (this.settings.showDefaultContext) {
							menu.addItem((item) => {
								item
								.setTitle("Generate reference (default style)")
								.setIcon(defaultLogo)
								.onClick(async () => this.replaceLinks(editor, text, false, this.settings.currentStyle))
							});	
						}
						
						if (this.settings.showSelectContext) {
							menu.addItem((item) => {
								item
								.setTitle("Generate reference (select style)")
								.setIcon(selectLogo)
								.onClick(async () => this.generateFromSuggestionModal(editor, text, false))
							})	
						}	
					}	
				}
			})
		);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	generateFromSuggestionModal(editor: Editor, text: string, selected: boolean) {
		new SuggestStyleModal(this.app, (result) => {
			if (result !== undefined) {
				const found = cslList.find((value) => value === result);

				if (found) {
					if (text.length > 0) {
						this.replaceLinks(editor, text, selected, found.id);
					}
				} else {
					new Notice("Error: Could not find selected style.");
				}
			}
		}).open();
	}

	notify(message: string) {
		if (this.settings.enableGenerationNotifications) {
			new Notice(message);
		}
	}

	async replaceLinks(editor: Editor, text: string, selected: boolean, style: string) {
		const file = this.app.workspace.getActiveFile();
		const mouseLine = editor.getCursor("from").line;

		// Cool down
		const currentTime = new Date();
		const timeElapsed = currentTime.valueOf() - this.lastGenerationTime.valueOf();

		if (timeElapsed <= 1000) {
			const timeLeft = (1000 - timeElapsed) / 1000;
			new Notice("You are generating too fast. Please try again after: " + Math.round(timeLeft) + " seconds");
			return;
		}

		this.lastGenerationTime = new Date();

		// Finds links within selection
		const foundLinks = text.match(/\bhttps?::\/\/\S+/gi) || text.match(/\bhttps?:\/\/\S+/gi);

		if (foundLinks == null) {
			new Notice("Not a link");
			return;
		}

		// Begin Generating
		this.notify("Generating (1/2)");
		
		if (this.settings.showGenerationText) {
			if (selected) {
				editor.replaceSelection("Generating...");
			} else {
				editor.setLine(mouseLine, "Generating...");
			}
		} else {
			if (selected) {
				editor.replaceSelection(" ");
			} else {
				editor.setLine(mouseLine, " ");
			}
		}
			
		// Removes duplicate links
		const set = new Set(foundLinks);
		const iteratable = set.values();
		let links = Array.from(iteratable);
		
		// Add a citation for each link
		const generator = new CitationGenerator(style, this.settings.includeDateAccessed);
		await generator.createEngine();
		
		for (let i = 0; i < links.length; i++) {
			const link = links[i];
			const citation = await generator.addCitation(link);

			if (citation === undefined) {
				editor.setLine(mouseLine, text);

				return;
			}

			if (this.settings.showGenerationText) {
				editor.setLine(mouseLine, `Generating (${i}/${links.length})`);
			}        
		}

		// Get formatted citations
		const bibliography = await generator.getBibliography(this.settings.sortByAlphabetical);

		if (bibliography === undefined) {
			editor.setLine(mouseLine, text);
			new Notice("Error: Could not get bibliography.");
			return;
		}

		const formattedBibliography = await generator.getBibliographyInFormat(bibliography, this.settings.textFormat);

		if (formattedBibliography === undefined) {
			editor.setLine(mouseLine, text);
			new Notice("Error: Could not get formatted bibliography.");
			return;
		}

		let replaceString = "";

		for (let i = 0; i < formattedBibliography.length; i++) {
			replaceString += formattedBibliography[i].trim() + "\n\n";
		}

		// Finish
		editor.setLine(mouseLine, replaceString);
		
		this.notify("Done (2/2)");
	}
}