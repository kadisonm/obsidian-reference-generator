/* Methods of finding date published:
    - Searching for classes including:
        date-created,

    - Checking for the 'Time' tag and using it's textContent
    - Checking for the 'Time' tag and finding it's 'datetime' attribute
    - Looking for a div class containing '_dateline' (To be done)
*/

const moment = require('moment');

export const getDateMethod1 = (doc: Document) : string => {
    let timeElement = doc.getElementsByTagName("Time")[0];

    if (timeElement) {
        const datetimeAttribute = timeElement.getAttribute('datetime');

        if (datetimeAttribute) {
           const dateObject = new Date(datetimeAttribute);
            return dateObject.getFullYear().toString(); 
        }
    }
    
    return "";
}

export const getDateMethod2 = (doc: Document) : string => {
    let timeElement = doc.getElementsByTagName("Time")[0];

    if (timeElement) {
        const datetimeAttribute = timeElement.getAttribute('datetime');

        if (datetimeAttribute == null) {
            const date = timeElement.textContent;

            if (date) {
                const dateObject = new Date(date);
                return dateObject.getFullYear().toString();
            }
        }
    }

    return ""
}

export const getDateMethod3 = (doc: Document) : string => {
    function checkClass(className : string) : string {
        let timeElement = doc.getElementsByClassName(className)[0];

        if (timeElement) {
            const date = timeElement.textContent;

            if (date) {
                const year = date.match(/\b\d{4}\b/);;
                
                if (year) {
                    return year[0];
                }
            } 
        }

        return ""
    }

    let classes = ["date-created", "created-time"];

    for (let i = 0; i < classes.length; i++) {
        let result = checkClass(classes[i]);

        if (result != "") {
            return result;
        }
    }

    return "";
}