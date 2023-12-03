import { getMetaData } from "../helpers";

export function getPublicationDate(doc: Document): any { 
    const methods = [method1, method2];

    for (const method of methods) {
        const result = method(doc);

        if (result !== null) {
            return result;
        }
    }

    return;
}

export function method1(doc: Document): any {
    const meta = getMetaData(doc, "published");

    if (meta.length != 0) {
        const dateObject = new Date(meta[0]);

        if (!isNaN(dateObject.getDate())) {
            return dateObject;
        }
    }

    return;
}

export function method2(doc: Document): any {
    const timeElement = doc.getElementsByTagName("Time")[0];

    if (timeElement) {
        const datetimeAttribute = timeElement.getAttribute('datetime');

        if (datetimeAttribute) {
            const dateObject = new Date(datetimeAttribute);

            if (!isNaN(dateObject.getDate())) {
                return dateObject;
            }
        }
        else if (datetimeAttribute == null) {
            const date = timeElement.textContent;

            if (date) {
                const dateObject = new Date(date);

                if (!isNaN(dateObject.getDate())) {
                    return dateObject;
                }
            }
        }
    }
    
    return;
}