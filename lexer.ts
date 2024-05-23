export enum TokenType {
    Number,
    Operator,
    Identifier,
    BinaryOperator,
    String,
    Whitespace,
    Newline,
    Let,
    ParenLeft,
    ParenRight,
    Unknown,
}

export interface Token {
    value: string;
    type: TokenType;
}

export const getToken = (value = "", type: TokenType): Token => {
    return { value, type };
};

export const Tokenize = (input: string): Token[] => {
    const tokens = new Array<Token>();
    const src = input.split("");

    const isLetter = (char: string) => /^[a-zA-Z]$/.test(char);
    const isDigit = (char: string) => /^[0-9]$/.test(char);
    const isWhitespace = (char: string) => /^\s$/.test(char);

    while (src.length > 0) {
        let char = src[0];

        // Handle whitespace
        if (isWhitespace(char)) {
            tokens.push(getToken(src.shift()!, TokenType.Whitespace));
            continue;
        }

        // Handle numbers
        if (isDigit(char)) {
            let numStr = "";
            while (isDigit(src[0])) {
                numStr += src.shift();
            }
            tokens.push(getToken(numStr, TokenType.Number));
            continue;
        }

        // Handle identifiers and keywords
        if (isLetter(char)) {
            let idStr = "";
            while (isLetter(src[0]) || isDigit(src[0])) {
                idStr += src.shift();
            }
            const type = (idStr === "let") ? TokenType.Let : TokenType.Identifier;
            tokens.push(getToken(idStr, type));
            continue;
        }

        // Handle operators and punctuation
        switch (char) {
            case '+':
            case '-':
            case '*':
            case '/':
                tokens.push(getToken(src.shift()!, TokenType.BinaryOperator));
                break;
            case '=':
                tokens.push(getToken(src.shift()!, TokenType.Operator));
            case '(':
                tokens.push(getToken(src.shift()!, TokenType.ParenLeft));
                break;
            case ')':
                tokens.push(getToken(src.shift()!, TokenType.ParenRight));
                break;
            default:
                tokens.push(getToken(src.shift()!, TokenType.Unknown));
                break;
        }
    }

    return tokens;
};

// Example usage
const sourceCode = `let x = 60 + (hi*there)`;
const tokens = Tokenize(sourceCode);
tokens.forEach(token => {
    console.log(`Token Type: ${TokenType[token.type]}, Value: '${token.value}'`);
});