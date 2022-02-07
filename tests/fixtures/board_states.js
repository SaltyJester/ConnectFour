const horizontalCases = [
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,1,1,1,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [1,1,1,1,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [1,1,1,1,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,1,1,1,1],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,1,1,1,1,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
];

const verticalCases = [
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,1]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    }
];

const diagonalCases = [
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [1,0,0,0,0,0,0],
            [0,1,0,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [1,0,0,0,0,0,0],
            [0,1,0,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,1,0,0,0],
            [0,0,1,0,0,0,0],
            [0,1,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0],
            [0,1,0,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,1,0,0,0,0],
            [0,1,0,0,0,0,0],
            [1,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,1,0],
            [0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0],
            [0,0,0,0,0,1,0],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0],
            [0,0,0,0,0,1,0],
            [0,0,0,0,0,0,1]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1],
            [0,0,0,0,0,1,0],
            [0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0],
            [0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0],
            [0,0,1,0,0,0,0],
            [0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 1
    },
];

const tieCases = [
    {
        board: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        expected: 0
    },
    {
        board: [
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,0,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1]
        ],
        expected: 0
    },
    {
        board: [
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1]
        ],
        expected: -1
    },
];

module.exports = {
    horizontalCases,
    verticalCases,
    diagonalCases,
    tieCases
}