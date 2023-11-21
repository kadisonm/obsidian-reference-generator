import { App, PluginSettingTab, Setting, Platform } from "obsidian";
import ReferenceGeneratorPlugin from "./main";

export interface ReferenceGeneratorSettings {
	enableDesktopNotifications: boolean,
    enableMobileNotifications: boolean,
}

export const DEFAULT_SETTINGS: ReferenceGeneratorSettings = {
	enableDesktopNotifications: true,
    enableMobileNotifications: true,
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

        // Enable Desktop Notifications
        if (!Platform.isMobileApp) {
            new Setting(containerEl)
                .setName('Enable Desktop Notifications')
                .setDesc('Enable notifications on desktop. (does not include errors)')
                .addToggle((toggle) => {
                    toggle
                    .setValue(this.plugin.settings.enableDesktopNotifications)
                    .onChange(async (val) => {
                      this.plugin.settings.enableDesktopNotifications = val;
                      await this.plugin.saveSettings();
                      
                    }); 
                })
        }	

        // Enable Mobile Notifications
        if (Platform.isMobileApp) {
            new Setting(containerEl)
                .setName('Enable Mobile Notifications')
                .setDesc('Enable notifications on mobile. (does not include errors)')
                .addToggle((toggle) => {
                    toggle
                    .setValue(this.plugin.settings.enableMobileNotifications)
                    .onChange(async (val) => {
                      this.plugin.settings.enableMobileNotifications = val;
                      await this.plugin.saveSettings();
                      
                    }); 
                })
        }	
	}
}