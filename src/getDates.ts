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