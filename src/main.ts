import { App, Menu, Editor, Notice, MarkdownView, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';
import { generateReference } from './generateReference';

interface ReferenceGeneratorSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ReferenceGeneratorSettings = {
	mySetting: 'default'
}

export default class ReferenceGeneratorPlugin extends Plugin {
	settings: ReferenceGeneratorSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				if (editor.getSelection().length > 0) {
					menu.addItem((item) => {
						item
						.setTitle("Generate Harvard Reference")
						.setIcon("document")
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

class SampleSettingTab extends PluginSettingTab {
	plugin: ReferenceGeneratorPlugin;

	constructor(app: App, plugin: ReferenceGeneratorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
