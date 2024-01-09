<h1 align="center">
<sub>
<img src="https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/d8b5fa31-7ba8-47c1-b1ca-aeecf52f3568" width="45">
</sub>
Reference Generator
</h1>

<h4 align="center">An <a href="https://obsidian.md/">Obsidian</a> plugin that quickly generates bibliographies from links in any style including Harvard, MLA, APA and more.</h4>

---

This plugin is **not** an official Obsidian plugin.

To track the development, please visit the [project page](https://github.com/users/kadisonm/projects/2/).

## Generation speed
Please note that in the current version (1.0.0) the plugin's generation time can be quite slow. This is due to relying on a third party API for citation data, which varies in speed for each link. The API also uses an outdated version of the [Zotero Translation Server](https://github.com/zotero/translation-server). Please take these into account and be prepared for slower generation speeds with a higher number of links.

On the bright side, there is a fix for this. A different implementation of the translation server is hopefully planned and possible for 1.1.0, so please keep an eye out.

## This plugin offers:
- Generating references for multiple links in one selection
- Over 2000 styles to choose from
- A variety of customisation and settings

## Installation
- Download the [latest release](https://github.com/kadisonm/obsidian-reference-generator/releases) and manually add the `main.js`, `manifest.json`, `styles.css` assets to `your-vault\.obsidian\plugins\reference-generator`

## Network usage
This plugins requires internet access for the following:
- To gather data such as authors, titles and more, a request must be made to the [Citoid API](https://www.mediawiki.org/wiki/Citoid/API).
- To use citation styles and locales a request for a CSL file and XML file must be made to the [Citation Style Language - Style Repository](https://github.com/citation-style-language/styles) and the [Citation Style Language - Locales Repository](https://github.com/citation-style-language/locales) on every generation.

## How to use
### Default styling
A default citation style can be selected in the plugin settings. This allows you to generate references without having to select a style each time. It is recommended to enable 'Sort by alphabetical order' for styles such as IEEE and MLA.

### Generating a reference
Right click on a link to open the context menu and display the generation options. You can either select a style or use your default (depending on your preferences either one of these can be disabled via settings). Alternatively, a command can be used for either.

![Obsidian_ZG6ZxvJQhJ](https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/dde9379f-4a4b-4d2d-9253-300fd5c83e17)

### Generating multiple references at a time
Select multiple links, right click and follow the same steps for generating a reference. Each link roughly takes 1-3 seconds to generate but they can take longer. There are plans in the future to heavily reduce this time. Text inbetween links is saved, but it will treat all links as a bibliography regardless of what text is inbetween. If you would like two seperately sorted bibliographies, it is best to generate these seperately.

![image](https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/6941ba65-ea57-4181-a83f-b03bd3169567)

*Image: Example of selecting multiple links to generate*

### Why am I receiving 'Error: Could not connect to site'
This is because the requested site could not be reached. This can happen due to network connectivity issues, or the requested page not existing on the site (404 error).

## Contributors
Thanks to @FeralFlora and @mariomui for helping steer this project in the right direction. Especially for coming up with the idea to use Citeproc-js and Zotero translators.

## Show your support

If you want to support me you can do so here, but please know that this is not expected and this plugin is completely free.

[<img src="https://github.com/kadisonm/obsidian-reference-generator/assets/134670047/826ead37-1265-42b1-b171-928d1e17035f" width="200">](https://www.buymeacoffee.com/kadisonm)

Thank you so much for using my plugin.
