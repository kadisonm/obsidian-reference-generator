import { Editor, Notice, MarkdownView, Plugin, Platform } from 'obsidian';
import { generateReference } from './generate-reference';
import { SettingsTab, ReferenceGeneratorSettings, DEFAULT_SETTINGS } from "./settings";
import { getRobots } from './helpers';
import { ReferenceStyle } from './citation';

const logo = "book-marked";

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
			icon: logo,
			
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				if (editor.getSelection().length > 0) {
					this.replaceLinks(editor, this.settings.defaultStyle);
				}
			},
		});
		
		// Selectable Style Command
		this.addCommand({
			id: 'generate-reference-selected',
			name: 'Generate reference (select style)',
			icon: logo,
			
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				if (editor.getSelection().length > 0) {
					//this.replaceLinks(editor);
				}
			},
		});

		// Context Menu Item (In default style)
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				if (editor.getSelection().length > 0) {
					menu.addItem((item) => {
						item
						.setTitle("Generate reference (default style)")
						.setIcon(logo)
						.onClick(async () => this.replaceLinks(editor, this.settings.defaultStyle));
					});
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

	async replaceLinks(editor: Editor, style: ReferenceStyle) {
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
		const selection = editor.getSelection();
		
		const foundLinks = selection.match(/\bhttps?::\/\/\S+/gi) || selection.match(/\bhttps?:\/\/\S+/gi);

		if (foundLinks == null) {
			new Notice("Not a link");
			return;
		}

		this.notify("Generating (1/2)");

		editor.replaceSelection("Generating...");
			
		// Removes duplicate links
		const set = new Set(foundLinks);
		const iteratable = set.values();
		const links = Array.from(iteratable);
		
		// Generates a reference for each link
		let replaceString = "";

		for (let i = 0; i < links.length; i++) {
			
			// Do I need this? vvv

			//const robots = await getRobots(links[i]);
			// if (robots.status == 400) { 
			// 	new Notice("The following site does not allow web scraping: " + links[i]);

			// 	editor.setLine(editor.getCursor("anchor").line, "");
			// 	editor.replaceSelection(selection);
			// 	return;
			// }
				
			const reference = await generateReference(links[i], style, this.settings.includeDateAccessed);

			if (i !== 0 && reference !== "") {
				replaceString += "\n";
			}

			if (reference !== "") {
				replaceString += reference + "\n";
			}	
		}

		editor.setLine(editor.getCursor("anchor").line, "");
		this.notify("Done (2/2)");
		editor.replaceSelection(replaceString);
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
