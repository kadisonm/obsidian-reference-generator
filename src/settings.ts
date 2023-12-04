import { App, PluginSettingTab, Setting, Platform } from "obsidian";
import ReferenceGeneratorPlugin from "./main";

export interface ReferenceGeneratorSettings {
    defaultStyle: string,
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
        .setDesc("Changes the default citation styling when generating references.")
        .addDropdown((dropdown) => {
          dropdown.addOption("university-of-york-harvard", "Harvard");
          dropdown.addOption("modern-language-association", "MLA");
          dropdown.addOption("apa", "APA");
          dropdown.addOption("chicago-note-bibliography", "Chicago");
          dropdown.addOption("ieee-transactions-on-medical-imaging", "IEEE");
          dropdown.addOption("university-of-york-harvard", "Other");
          dropdown
            .setValue(this.plugin.settings.defaultStyle)
            .onChange(async (val: string) => {
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
                .setDesc('Enable generation status notifications on desktop. (does not include errors)')
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