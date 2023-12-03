import { App, PluginSettingTab, Setting, Platform } from "obsidian";
import ReferenceGeneratorPlugin from "./main";

import { ReferenceStyle } from './citation';

export interface ReferenceGeneratorSettings {
    defaultStyle: ReferenceStyle,
    includeDateAccessed: boolean,
	enableDesktopNotifications: boolean,
    enableMobileNotifications: boolean,
}

export const DEFAULT_SETTINGS: ReferenceGeneratorSettings = {
    defaultStyle: "Harvard",
    includeDateAccessed: true,
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

        // Select Default Style
        new Setting(containerEl)
        .setName("Select default citation style")
        .setDesc("Changes the default citation styling when generating references. Please note that Harvard (Australia)'s link is between 2 zero width spaces as to not confused < and > for HTML.")
        .addDropdown((dropdown) => {
          dropdown.addOption("Harvard", "Harvard");
          dropdown.addOption("Harvard (Australia)", "Harvard (Australia)");
          dropdown
            .setValue(this.plugin.settings.defaultStyle)
            .onChange(async (val: ReferenceStyle) => {
                this.plugin.settings.defaultStyle = val;
                await this.plugin.saveSettings();
            });
        });


        // Enable Show Accessed
        new Setting(containerEl)
            .setName('Include date accessed')
            .setDesc('Toggle date accessed within your references (if applicable)')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.includeDateAccessed)
                .onChange(async (val) => {
                    this.plugin.settings.includeDateAccessed = val;
                    await this.plugin.saveSettings();
                }); 
            })

        // Enable Desktop Notifications
        if (!Platform.isMobileApp) {
            new Setting(containerEl)
                .setName('Enable desktop notifications')
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
                .setName('Enable mobile notifications')
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