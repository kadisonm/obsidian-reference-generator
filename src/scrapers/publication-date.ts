import { getMetaData } from "../helpers";

export function getPublicationDate(doc : Document) : string { 
    const methods = [method1, method2];

    for (const method of methods) {
        const result = method(doc);

        if (result != "") {
          return "(" + result + "). ";
        }
    }

    return "(n.d.). ";
}

const getYearFromString = (date: string) : string => {
    const dateObject = new Date(date);

    if (!isNaN(dateObject.getDate()))
        return dateObject.getFullYear().toString();

    return "";
}

const method1 = (doc: Document) : string => {
    const meta = getMetaData(doc, "published");

    if (meta.length != 0)
        return getYearFromString(meta[0]);

    return "";
}

const method2 = (doc: Document) : string => {
    const timeElement = doc.getElementsByTagName("Time")[0];

    if (timeElement) {
        const datetimeAttribute = timeElement.getAttribute('datetime');

        if (datetimeAttribute) {
            return getYearFromString(datetimeAttribute);
        }
        else if (datetimeAttribute == null) {
            const date = timeElement.textContent;

            if (date)
                return getYearFromString(date);
        }
    }
    
    return "";
}