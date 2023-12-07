<h1 align="center"> Obsidian Reference Generator </h1>
<p align="center"> An <a href="https://obsidian.md/">Obsidian</a> plugin that quickly generates citations from links in any style including Harvard, MLA, APA and more.

![Group 34](https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/2d4d977e-f068-46d9-b0c5-0e7e89bb4310)

*The image above is for illustrative purposes and is not an accurate reflection of the plugin's appearance.*

This plugin is **not** an official Obsidian plugin.

To track the development, please visit its [project page](https://github.com/users/kadisonm/projects/2/).

## This plugin offers:
- Generating references for multiple links in one selection
- Over 2000 styles to choose from
- A variety of customisation and settings

## Installation
- Download the [latest release](https://github.com/kadisonm/obsidian-reference-generator/releases) and manually add the `main.js`, `manifest.json`, `styles.css` assets to `your-vault\.obsidian\plugins\reference-generator`

## Network usage
This plugins requires internet access for the following:
- To gather data such as authors, titles and more, a request must be made to the selected website.
- To use citation styles and locales a request for a CSL file and XML file must be made to the [Citation Style Language - Style Repository](https://github.com/citation-style-language/styles) and the [Citation Style Language - Locales Repository](https://github.com/citation-style-language/locales) on every generation.

## How to use
### Default styling
A default citation style can be selected in the plugin settings. This allows you to generate references without having to select it each time.

### Generating a reference
Select a link and right click to open the context menu. This will display to generation options, allowing you to either select a style or use your default. Alternatively, a command can be used from the command bar. Depending on your preferences either one of these can be disabled via settings.

![Obsidian_ZG6ZxvJQhJ](https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/dde9379f-4a4b-4d2d-9253-300fd5c83e17)

### Generating multiple references at a time
Select multiple links, right click and follow the same steps for generating a reference. This will take more time depending on how many links you are generating.

![image](https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/6941ba65-ea57-4181-a83f-b03bd3169567)

### Why am I receiving 'Error: Could not connect to site'
This is because the requested site could not be reached. This can happen due to network connectivity issues, or the requested page not existing on the site (404 error).

## Contributors
Thanks to @FeralFlora and @mariomui for helping steer this project in the right direction. Especially for coming up with the idea to use Citeproc-js and potentially Zotero trackers in the future.

## Show your support

If you want to support me you can do so here, but please know that this is not expected and this plugin is completely free.

[<img src="https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/826ead37-1265-42b1-b171-928d1e17035f" width="200">](https://www.buymeacoffee.com/kadisonm)

Thank you so much for using my plugin.
