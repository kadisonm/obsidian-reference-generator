import { App, Menu, Editor, Notice, MarkdownView, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';
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
					const reference = await generateReference(editor.getSelection());
					editor.replaceSelection(reference);
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
						.onClick(async () => {
							const reference = await generateReference(editor.getSelection());
							editor.replaceSelection(reference);
						});
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
}
