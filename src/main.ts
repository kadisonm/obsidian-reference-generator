import { Editor, Notice, MarkdownView, Plugin, Platform } from 'obsidian';
import { SettingsTab, ReferenceGeneratorSettings, DEFAULT_SETTINGS } from "./settings";
import { SuggestStyleModal } from './suggest-modal'; 
import { generateReference } from './generate-reference';
import { cslList } from "./csl/csl-list";
import TurndownService from 'turndown'
import { link } from 'fs';

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
				if (editor.getSelection().length > 0) {
					this.replaceLinks(editor, this.settings.currentStyle);
				}
			},
		});
		
		// Selectable Style Command
		this.addCommand({
			id: 'generate-reference-selected',
			name: 'Generate reference (select style)',
			icon: selectLogo,
			
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				if (editor.getSelection().length > 0) {
					this.generateFromSuggestionModal(editor)
				}
			},
		});

		// Context Menu Items
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				if (editor.getSelection().length > 0) {
					if (this.settings.showDefaultContext) {
						menu.addItem((item) => {
							item
							.setTitle("Generate reference (default style)")
							.setIcon(defaultLogo)
							.onClick(async () => this.replaceLinks(editor, this.settings.currentStyle))
						});	
					}
					
					if (this.settings.showSelectContext) {
						menu.addItem((item) => {
							item
							.setTitle("Generate reference (select style)")
							.setIcon(selectLogo)
							.onClick(async () => this.generateFromSuggestionModal(editor))
						})	
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

	generateFromSuggestionModal(editor: Editor) {
		new SuggestStyleModal(this.app, (result) => {
			if (result !== undefined) {
				const found = cslList.find((value) => value === result);

				if (found) {
					if (editor.getSelection().length > 0) {
						this.replaceLinks(editor, found.id);
					}
				} else {
					new Notice("Error: Could not find selected style.");
				}
			}
		}).open();
	}

	async replaceLinks(editor: Editor, style: string) {
		const selection = editor.getSelection();
		const file = this.app.workspace.getActiveFile();
		const mouseLine = editor.getCursor("from").line;

		// Cool down
		const currentTime = new Date();
		const timeElapsed = currentTime.valueOf() - this.lastGenerationTime.valueOf();

		if (timeElapsed <= 2000) {
			const timeLeft = (2000 - timeElapsed) / 1000;
			new Notice("You are generating too fast. Please try again after: " + Math.round(timeLeft) + " seconds");
			return;
		}

		this.lastGenerationTime = new Date();

		// Finds links within selection
		const foundLinks = selection.match(/\bhttps?::\/\/\S+/gi) || selection.match(/\bhttps?:\/\/\S+/gi);

		if (foundLinks == null) {
			new Notice("Not a link");
			return;
		}

		// Begin Generating
		this.notify("Generating (1/2)");
		
		if (this.settings.showGenerationText) {
			editor.replaceSelection("Generating...");
		} else {
			editor.replaceSelection(" ");
		}
			
		// Removes duplicate links
		const set = new Set(foundLinks);
		const iteratable = set.values();
		let links = Array.from(iteratable);
		
		// Generates a reference for each link
		let references = new Array();

		for (let i = 0; i < links.length; i++) {
			const link = links[i];
			
			const reference = await generateReference(link, style, this.settings.includeDateAccessed);

			if (reference !== undefined) {
				references.push(reference);

				if (this.settings.showGenerationText) {
					editor.setLine(mouseLine, `Generating (${i}/${links.length})`);
				}
			} else {
				editor.setLine(mouseLine, selection);
				return;
			}
		}

		// Sorts by alphabetical order
		if (this.settings.sortByAlphabetical) {
			references.sort(function (a, b) {
				const plaintextA = a.replace(/<[^>]+>/g, '');
				const plaintextB = b.replace(/<[^>]+>/g, '');

				return plaintextA.localeCompare(plaintextB)
			});	
		}

		// Converts into string
		let replaceString = "";
		const turndownService = new TurndownService()

		for (let i = 0; i < references.length; i++) {
			const reference = references[i];

			if (this.settings.textFormat === "html") {
				replaceString += reference;
			} else if (this.settings.textFormat === "plaintext") {
				replaceString += reference.replace(/<[^>]+>/g, '');
			} else {
				replaceString += turndownService.turndown(reference);
			}

			if (i !== references.length - 1) {
				replaceString += "\n\n";
			}

			if (this.settings.showGenerationText) {
				editor.setLine(mouseLine, `Sorting... (${i}/${links.length})`);
			}
		}

		// Finish
		editor.setLine(mouseLine, replaceString);
		
		this.notify("Done (2/2)");
	}

	notify(message: string) {
		if (this.settings.enableDesktopNotifications && !Platform.isMobileApp) {
			new Notice(message);
		}
		else if (this.settings.enableMobileNotifications && Platform.isMobileApp) {
			new Notice(message);
		}
	}
}