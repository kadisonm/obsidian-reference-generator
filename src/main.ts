import { Editor, Notice, MarkdownView, Plugin, Platform } from 'obsidian';
import { generateReference } from './generateReference';
import { SettingsTab, ReferenceGeneratorSettings, DEFAULT_SETTINGS } from "./settings";

const logo = "book-marked";

export default class ReferenceGeneratorPlugin extends Plugin {
	settings: ReferenceGeneratorSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

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
		// Finds links within selection
		const selection = editor.getSelection();
		
		const foundLinks = selection.match(/\bhttps?::\/\/\S+/gi) || selection.match(/\bhttps?:\/\/\S+/gi);
  
		if (foundLinks == null) {
			new Notice("Not a link");
			return;
		}

		this.notify("Generating (1/2)");
			
		// Removes duplicate links
		let s = new Set(foundLinks);
		let it = s.values();
		const links = Array.from(it);

		
		// Generates a reference for each link
		
		let replaceString = "";

		for (var i = 0; i < links.length; i++) {
			const reference = await generateReference(links[i]);
			replaceString += "\n" + reference + "\n";
		}

		//const reference = await generateReference(selection);
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
