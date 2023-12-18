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

const bibliography : Array<Citation> = [
    {
        "id": 0,
        "type": "webpage",
        "title": "B Test page",
        "URL": "https://www.faketestsite.com/testB",
        "author": [
            {
                "given": "John",
                "family": "Doe"
            },
            {
                "given": "Jane",
                "family": "Doe"
            }
        ],
        "container-title": "Fake Test Site",
        "issued": {
            "date-parts": [[2023, 11, 2]]
        },
        "accessed": {
            "date-parts": [[2023, 12, 18]]
        }
    },
    {
        "id": 1,
        "type": "webpage",
        "title": "A Test page",
        "URL": "https://www.faketestsite.com/testA",
        "author": [
            {
                "given": "John",
                "family": "Doe"
            },
            {
                "given": "Jane",
                "family": "Doe"
            }
        ],
        "container-title": "Fake Test Site",
        "issued": {
            "date-parts": [[2023, 11, 2]]
        },
        "accessed": {
            "date-parts": [[2023, 12, 18]]
        }
    }
];

export default bibliography;