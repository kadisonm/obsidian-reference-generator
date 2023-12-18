interface Citation {
    "id": number,
    "type": string,
    "title"?: string,
    "container-title"?: string,
    "URL": string,
    "author"?: Array<Author>,
    "issued"?: {
        "date-parts": [[number, number, number]],
    },
    "accessed"?: {
        "date-parts": [[number, number, number]],
    }
};

interface Author {
    "given"?: string, 
    "family"?: string
}

// B comes before A by default to test sorting

const citations : Array<Citation> = [
    {
        "id": 0,
        "type": "webpage",
        "title": "2",
        "URL": "https://www.faketestsite.com/testB",
    },
    {
        "id": 1,
        "type": "webpage",
        "title": "1",
        "URL": "https://www.faketestsite.com/testA",
    }
];

export default citations;