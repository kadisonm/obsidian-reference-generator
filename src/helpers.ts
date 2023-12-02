export function getMetaData(doc: Document, name: string) : Array<string> {
    const meta = doc.getElementsByTagName('meta');
    
    let data = new Array<string>();
    
    for (let i = 0; i < meta.length; i++) { 
       
        // Check if a metadata name is passed name
        if (meta[i].name.includes(name)) {
            const found = meta[i].content;

            console.log(found);

            if (!data.includes(found)) {
                data.push(found);
            }
        }

        // Check if a metadata property is passed name
        if (meta[i].getAttribute("property")?.includes(name)) {
            const found = meta[i].content;

            console.log(found);

            if (!data.includes(found)) {
                data.push(found);
            }
        }           
    }
    
    return data;
}

export function isUrl(url : string) {
    try {
      new URL(url);
      return true;
    } 
    catch (err) {
      return false;
    }
}