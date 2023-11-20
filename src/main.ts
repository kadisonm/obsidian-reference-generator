import { App, Menu, Editor, Notice, MarkdownView, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

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
			  	menu.addItem((item) => {
					item
					.setTitle("Generate Harvard Reference")
					.setIcon("document")
					.onClick(async () => {
						const reference = await this.generateReference(editor.getSelection());
						editor.replaceSelection(reference);
				  	});
			    });
			})
		);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async generateReference(url : string) {
		const reference = {
			firstName: "",
			lastName: "",
			published: "",
			title: "",
			siteName: "",
			link: url
		};

		const result = await requestUrl(url);
		const parser = new DOMParser();
        const doc = parser.parseFromString(result.text, "text/html");
	
		// Author, date published. Title. [online] website name. Available at: URL.
		// If no author then use site name.

		//reference.firstName = + ". ";
		//reference.lastName = + ", ";
		//reference.published = "(" + __ + ").";
		//reference.siteName = "" + ". ";

		reference.title = doc.title + ". ";
		reference.title = reference.title.replace(reference.siteName, ""); // Need to make it so it doesn't include the + ". ";

		return `${reference.lastName}${reference.firstName}${reference.published}${reference.title}[online] ${reference.siteName}Available at: ${reference.link}`;
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
