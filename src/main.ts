import { Editor, Notice, MarkdownView, Plugin, Platform } from 'obsidian';
import { generateReference } from './generate-reference';
import { SettingsTab, ReferenceGeneratorSettings, DEFAULT_SETTINGS } from "./settings";
import { getRobots } from './helpers';

const logo = "book-marked";

export default class ReferenceGeneratorPlugin extends Plugin {
	settings: ReferenceGeneratorSettings;
	lastGenerationTime: Date;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		this.lastGenerationTime = new Date();

		// Generator command
		this.addCommand({
			id: 'generate-harvard-reference',
			name: 'Generate Harvard Reference',
			icon: logo,
			
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				if (editor.getSelection().length > 0) {
					this.replaceLinks(editor);
				}
			},
		});

		// Context menu item
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				if (editor.getSelection().length > 0) {
					menu.addItem((item) => {
						item
						.setTitle("Generate Harvard Reference")
						.setIcon(logo)
						.onClick(async () => this.replaceLinks(editor));
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

	async replaceLinks(editor: Editor) {
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
			const robots = await getRobots(links[i]);

			if (robots.status == 400) {
				new Notice("The following site does not allow web scraping: " + links[i]);

				editor.setLine(editor.getCursor("anchor").line, "");
				editor.replaceSelection(selection);
				return;
			}
				
			const reference = await generateReference(links[i]);

			replaceString += "\n" + reference + "\n";
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
