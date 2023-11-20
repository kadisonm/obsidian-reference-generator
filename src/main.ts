import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

var JSSoup = require('jssoup').default



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

		this.addCommand({
			id: 'generate-harvard-reference-from-link',
			name: 'Generate Harvard Reference From Link',
			callback: () => {
				
			}
		});

		this.addCommand({
			id: 'generate-harvard-reference',
			name: 'Generate Harvard Reference',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				let reference = this.GenerateReference(editor.getSelection());
				editor.replaceSelection(reference);
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	GenerateReference(url : string) : string {
		let result = "Failed";

		fetch(url)
		.then(response => {
			response.json()
		})
		.then(json=> {
			console.log(json);

			result = "Worked";
		})
		.catch(error => {
			result = "Cannot get URL";
		})

		return result;
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
