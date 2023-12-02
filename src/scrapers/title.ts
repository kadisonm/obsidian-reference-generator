export function getTitle(doc : Document) : string {
    let title = "";

    if (doc.title != "") {
        title = doc.title;
        title = title.split('|')[0]
        title = title.trim();
        title += ". "
    }
  
    return title;
}