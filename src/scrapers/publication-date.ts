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

// Convert date string to year

const getYearFromString = (date: string) : string => {
    const dateObject = new Date(date);

    if (!isNaN(dateObject.getDate()))
        return dateObject.getFullYear().toString();

    return "";
}

// Methods of finding the publication date

// Looks for Meta data containing "published" and converts
export const method1 = (doc: Document) : string => {
    const meta = getMetaData(doc, "published");

    if (meta.length != 0)
        return getYearFromString(meta[0]);

    return "";
}

// Checks for Time tag converts with datetimeAttribute or textContent
// Less effective as it can confuse any Time element for the publish date
export const method2 = (doc: Document) : string => {
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

// Check for class containing time

// const method4 = (doc: Document) : string => {
//     function checkClass(className : string) : string {
//         let timeElement = doc.getElementsByClassName(className)[0];

//         if (timeElement) {
//             const date = timeElement.textContent;

//             if (date) {
//                 const year = date.match(/\b\d{4}\b/);;
                
//                 if (year) {
//                     return year[0];
//                 }
//             } 
//         }

//         return ""
//     }

//     let classes = ["date-created", "created-time"];

//     for (let i = 0; i < classes.length; i++) {
//         let result = checkClass(classes[i]);

//         if (result != "") {
//             return result;
//         }
//     }

//     return "";
// }