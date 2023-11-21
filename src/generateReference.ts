import { requestUrl } from 'obsidian';

export const generateReference = async (url: string) => {
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

    let referenceString = `${reference.lastName}${reference.firstName}${reference.published}${reference.title}[online] ${reference.siteName}Available at: ${reference.link}`;

    return referenceString;
}