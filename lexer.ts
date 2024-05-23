export enum TokenType {
    Number,
    Operator,
    Identifier,
    Keyword,
    String,
    Whitespace,
    Newline,
    ParenLeft,
    ParenRight,
    Unknown,
}

export interface Token {
    value: string;
    type: TokenType;
    line: number;
    column: number;
}

export const getToken = (value = "", type: TokenType, line: number, column: number): Token => {
    return { value, type, line, column };
};

export const Tokenize = (input: string): Token[] => {
    const tokens: Token[] = [];
    const length = input.length;
    let position = 0;
    let line = 1;
    let column = 1;

    const isLetter = (char: string) => /^[a-zA-Z]$/.test(char);
    const isDigit = (char: string) => /^[0-9]$/.test(char);
    const isWhitespace = (char: string) => /^\s$/.test(char);
    const newLine = (char: string) => char === '\n';

    while (position < length) {
        let char = input[position];

        // Handle newline
        if (newLine(char)) {
            tokens.push(getToken(char, TokenType.Newline, line, column));
            position++;
            line++;
            column = 1;
            continue;
        }

        // Handle whitespace
        if (isWhitespace(char)) {
            tokens.push(getToken(char, TokenType.Whitespace, line, column));
            position++;
            column++;
            continue;
        }

        // Handle numbers
        if (isDigit(char)) {
            let start = position;
            while (isDigit(input[position])) {
                position++;
                column++;
            }
            const numStr = input.slice(start, position);
            tokens.push(getToken(numStr, TokenType.Number, line, column - numStr.length));
            continue;
        }

        // Handle string literals
        if (char === '"' || char === "'") {
            let str = "";
            let quoteType = char;
            position++; // Remove the opening quote
            column++;
            while (position < length && input[position] !== quoteType) {
                str += input[position];
                position++;
                column++;
            }
            position++; // Remove the closing quote
            column++;
            tokens.push(getToken(str, TokenType.String, line, column - str.length - 2)); // -2 for the quotes
            continue;
        }

        // Handle identifiers and keywords
        if (isLetter(char)) {
            let start = position;
            while (isLetter(input[position]) || isDigit(input[position])) {
                position++;
                column++;
            }
            const idStr = input.slice(start, position);
            const type = (idStr === "let") ? TokenType.Keyword : TokenType.Identifier;
            tokens.push(getToken(idStr, type, line, column - idStr.length));
            continue;
        }

        // Handle operators and punctuation
        switch (char) {
            case '+':
            case '-':
            case '*':
            case '/':
                tokens.push(getToken(char, TokenType.Operator, line, column));
                position++;
                column++;
                break;
            case '(':
                tokens.push(getToken(char, TokenType.ParenLeft, line, column));
                position++;
                column++;
                break;
            case ')':
                tokens.push(getToken(char, TokenType.ParenRight, line, column));
                position++;
                column++;
                break;
            default:
                tokens.push(getToken(char, TokenType.Unknown, line, column));
                position++;
                column++;
                break;
        }
    }

    return tokens;
};

// Example usage
const sourceCode = `let x = 60 + (hi*tushar) let str = "hello world"`;
const tokens = Tokenize(sourceCode);
tokens.forEach(token => {
    console.log(`Token Type: ${TokenType[token.type]}, Value: '${token.value}', Line: ${token.line}, Column: ${token.column}`);
});