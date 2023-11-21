import { App, PluginSettingTab, Setting } from "obsidian";
import ReferenceGeneratorPlugin from "./main";

export interface ReferenceGeneratorSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: ReferenceGeneratorSettings = {
	mySetting: 'default'
}

export class SettingsTab extends PluginSettingTab {
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