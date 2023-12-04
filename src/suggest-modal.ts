import { App, SuggestModal } from "obsidian";
import { cslList } from "./csl/csl-list";

interface Style {
    label: string;
    id: string;
    value: string;
}

export class SuggestStyleModal extends SuggestModal<Style> {
    result: Style;
    onSubmit: (result: Style) => void;

    constructor(app: App, onSubmit: (result: Style) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    getSuggestions(query: string): Style[] {
        return cslList.filter((style) => style.label.toLowerCase().includes(query.toLowerCase()) || style.id.toLowerCase().includes(query.toLowerCase()));
    }

    renderSuggestion(style: Style, el: HTMLElement) {
        el.createEl("div", { text: style.label });
        el.createEl("small", { text: style.id });
    }

    onChooseSuggestion(style: Style, evt: MouseEvent | KeyboardEvent) {
        this.result = style;
        this.onSubmit(this.result);
    }
}