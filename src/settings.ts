import { App, PluginSettingTab, Setting, Platform, Notice } from "obsidian";
import ReferenceGeneratorPlugin from "./main";
import { SuggestStyleModal } from "./suggest-modal";
import { cslList } from "./csl/csl-list";

export interface ReferenceGeneratorSettings {
    currentStyle: string,
    defaultStyle: string,
    includeDateAccessed: boolean,
    textFormat: string,
    sortByAlphabetical: boolean,
    showGenerationText: boolean,
    showDefaultContext: boolean,
    showSelectContext: boolean,
	enableGenerationNotifications: boolean,
}

export const DEFAULT_SETTINGS: ReferenceGeneratorSettings = {
    currentStyle: "university-of-york-harvard",
    defaultStyle: "university-of-york-harvard",
    includeDateAccessed: true,
    textFormat: "markdown",
    sortByAlphabetical: true,
    showGenerationText: true,
    showDefaultContext: true,
    showSelectContext: true,
	enableGenerationNotifications: false,
}

export const defaultLogo = "refresh-cw";
export const selectLogo = "box-select";

export class SettingsTab extends PluginSettingTab {
	plugin: ReferenceGeneratorPlugin;

	constructor(app: App, plugin: ReferenceGeneratorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

        // Display 'other' style
        const otherDiv = containerEl.createEl("div");

        if (this.plugin.settings.defaultStyle !== "other") {
            otherDiv.textContent = "";
        } else {
            const found = cslList.find((value) => value.id === this.plugin.settings.currentStyle);

            if (found) {
                otherDiv.textContent = "Other: " + found.label;
            } 
        }

        // Select default style
        new Setting(containerEl)
        .setName("Default citation style")
        .setDesc("Changes the default citation styling when generating references.")
        .addDropdown((dropdown) => {
          dropdown.addOption("university-of-york-harvard", "Harvard");
          dropdown.addOption("modern-language-association", "MLA");
          dropdown.addOption("apa", "APA");
          dropdown.addOption("chicago-note-bibliography", "Chicago");
          dropdown.addOption("ieee-transactions-on-medical-imaging", "IEEE");
          dropdown.addOption("other", "Other");
          dropdown
            .setValue(this.plugin.settings.defaultStyle)
            .onChange(async (style) => {
                this.plugin.settings.defaultStyle = style;
                otherDiv.toggleClass("other-hide", this.plugin.settings.defaultStyle !== "other");

                if (style === "other") {
                    new SuggestStyleModal(this.app, async (result) => {
                        if (result !== undefined) {
                            const found = cslList.find((value) => value === result);
            
                            if (found) {
                                this.plugin.settings.currentStyle = found.id;

                                otherDiv.textContent = "Other: " + found.label;
                                new Notice("Updated style!");

                                await this.plugin.saveSettings();   
                            } else {
                                new Notice("Error: Could not find selected style.");
                            }
                        } else {
                            this.plugin.settings.currentStyle = DEFAULT_SETTINGS.currentStyle;
                            this.plugin.settings.defaultStyle = DEFAULT_SETTINGS.defaultStyle;

                            await this.plugin.saveSettings();
                        }
                    }).open();    
                } else {
                    this.plugin.settings.currentStyle = style;
                    this.plugin.settings.defaultStyle = style;

                    otherDiv.textContent = "";
                    
                    await this.plugin.saveSettings();
                }
            })
        });

        // Enable show accessed
        new Setting(containerEl)
            .setName('Include date accessed')
            .setDesc('Will include today\'s date as date accessed (if applicable)')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.includeDateAccessed)
                .onChange(async (val) => {
                    this.plugin.settings.includeDateAccessed = val;
                    await this.plugin.saveSettings();
                })
            })
        
        // Select generation text format
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
            })
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
                }) 
            })
        
        containerEl.createEl("h2", { text: "Advanced" });

        // Enable default generation context menu
        if (!Platform.isMobileApp) {
            new Setting(containerEl)
                .setName('Show default generation in context menu')
                .setDesc('Show the option for \'Generate reference (default style)\' in the context menu (right click menu).')
                .addToggle((toggle) => {
                    toggle
                    .setValue(this.plugin.settings.showDefaultContext)
                    .onChange(async (val) => {
                      this.plugin.settings.showDefaultContext = val;
                      await this.plugin.saveSettings();
                    }) 
                })
        }	

        // Enable select generation context menu
        if (!Platform.isMobileApp) {
            new Setting(containerEl)
                .setName('Show select generation in context menu')
                .setDesc('Show the option for \'Generate reference (select style)\' in the context menu (right click menu).')
                .addToggle((toggle) => {
                    toggle
                    .setValue(this.plugin.settings.showSelectContext)
                    .onChange(async (val) => {
                      this.plugin.settings.showSelectContext = val;
                      await this.plugin.saveSettings();
                    }) 
                })
        }	

        // Show generation text
        new Setting(containerEl)
            .setName('Show generation text')
            .setDesc('Show generation status within the document.')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.showGenerationText)
                .onChange(async (val) => {
                    this.plugin.settings.showGenerationText = val;
                    await this.plugin.saveSettings();
                }) 
            })

        // Enable generation status notifications
        new Setting(containerEl)
            .setName('Enable generation notifications')
            .setDesc('Enable generation status notifications. (does not include errors)')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.enableGenerationNotifications)
                .onChange(async (val) => {
                    this.plugin.settings.enableGenerationNotifications = val;
                    await this.plugin.saveSettings();
                }) 
            })
	}
}