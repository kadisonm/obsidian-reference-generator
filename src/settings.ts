import { App, PluginSettingTab, Setting, Platform } from "obsidian";
import ReferenceGeneratorPlugin from "./main";

export interface ReferenceGeneratorSettings {
    defaultStyle: string,
    includeDateAccessed: boolean,
    textFormat: string,
    sortByAlphabetical: boolean,
    showGenerationText: boolean,
	enableDesktopNotifications: boolean,
    enableMobileNotifications: boolean,
}

export const DEFAULT_SETTINGS: ReferenceGeneratorSettings = {
    defaultStyle: "Harvard",
    includeDateAccessed: true,
    textFormat: "markdown",
    sortByAlphabetical: true,
    showGenerationText: true,
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
        .setName("Default citation style")
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
            .setDesc('Will include today\'s date as date accessed (if applicable)')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.includeDateAccessed)
                .onChange(async (val) => {
                    this.plugin.settings.includeDateAccessed = val;
                    await this.plugin.saveSettings();
                }); 
            })
        
        // Select Generation Text Format
        new Setting(containerEl)
        .setName("Generation text format")
        .setDesc("Changes the default generation text format. Please note that Markdown uses \\ to escape Markdown characters in the citation style.")
        .addDropdown((dropdown) => {
          dropdown.addOption("markdown", "Markdown");
          dropdown.addOption("html", "HTML");
          dropdown.addOption("plaintext", "Plaintext");
          dropdown
            .setValue(this.plugin.settings.textFormat)
            .onChange(async (val: string) => {
                this.plugin.settings.textFormat = val;
                await this.plugin.saveSettings();
            });
        });

        // Sort by alphabetical order
        new Setting(containerEl)
            .setName('Sort by alphabetical order')
            .setDesc('Sort by alphabetical order when multiple citations are generated at the same time. This only applies if text isn\'t between them (like a heading).')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.sortByAlphabetical)
                .onChange(async (val) => {
                    this.plugin.settings.sortByAlphabetical = val;
                    await this.plugin.saveSettings();
                }); 
            })

        // Show generation text
        new Setting(containerEl)
            .setName('Show generation text')
            .setDesc('Show generation status with document.')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.showGenerationText)
                .onChange(async (val) => {
                    this.plugin.settings.showGenerationText = val;
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
                .setDesc('Enable generation status notifications on mobile. (does not include errors)')
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