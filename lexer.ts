export enum TokenType {
    Number,
    Operator,
    BinaryOperator,
    Identifier,
    Keyword,
    String,
    Whitespace,
    Newline,
    ParenLeft,
    ParenRight,
    BraceLeft,
    BraceRight,
    Comma,
    Semicolon,
    Colon,
    Dot,
    ComparisonOperator,
    LogicalOperator,
    Increment,
    Decrement,
    AssignmentOperator,
    Comment,
    Unknown,
    EOF
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

    const newLine = (char: string) => char === '\n';
    const isLetter = (char: string) => /^[a-zA-Z]$/.test(char);
    const isDigit = (char: string) => /^[0-9]$/.test(char);
    const isWhitespace = (char: string) => /^\s$/.test(char);

    while (position < length) {
        let char = input[position];

        switch (true) {
            // Handle newline
            case newLine(char):
                tokens.push(getToken(char, TokenType.Newline, line, column));
                position++;
                line++;
                column = 1;
                break;

            // Handle whitespace
            case isWhitespace(char):
                tokens.push(getToken(char, TokenType.Whitespace, line, column));
                position++;
                column++;
                break;

            // Handle numbers
            case isDigit(char):
                let start = position;
                while (position < length && isDigit(input[position])) {
                    position++;
                    column++;
                }
                const numStr = input.slice(start, position);
                tokens.push(getToken(numStr, TokenType.Number, line, column - numStr.length));
                break;

            // Handle string literals
            case char === '"' || char === "'":
                let str = "";
                let quoteType = char;
                position++;
                column++;
                while (position < length && input[position] !== quoteType) {
                    str += input[position];
                    position++;
                    column++;
                }
                position++;
                column++;
                tokens.push(getToken(str, TokenType.String, line, column - str.length - 2)); // -2 for the quotes
                break;

            // Handle identifiers and keywords
            case isLetter(char):
                let idStart = position;
                while (position < length && (isLetter(input[position]) || isDigit(input[position]))) {
                    position++;
                    column++;
                }
                const idStr = input.slice(idStart, position);
                const type = (idStr === "let") ? TokenType.Keyword : TokenType.Identifier;
                tokens.push(getToken(idStr, type, line, column - idStr.length));
                break;

            // Handle operators and punctuation
            default:
                switch (char) {
                    case '+':
                        if (input[position + 1] === '+') {
                            tokens.push(getToken('++', TokenType.Increment, line, column));
                            position += 2;
                            column += 2;
                        } else if (input[position + 1] === '=') {
                            tokens.push(getToken('+=', TokenType.AssignmentOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.BinaryOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '-':
                        if (input[position + 1] === '--') {
                            tokens.push(getToken('--', TokenType.Decrement, line, column));
                            position += 2;
                            column += 2;
                        } else if (input[position + 1] === '=') {
                            tokens.push(getToken('-=', TokenType.AssignmentOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.BinaryOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '*':
                        if (input[position + 1] === '=') {
                            tokens.push(getToken('*=', TokenType.AssignmentOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.BinaryOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '/':
                        if (input[position + 1] === '=') {
                            tokens.push(getToken('/=', TokenType.AssignmentOperator, line, column));
                            position += 2;
                            column += 2;
                        } else if (input[position + 1] === '/') {
                            let comment = '';
                            while (position < length && input[position] !== '\n') {
                                comment += input[position];
                                position++;
                                column++;
                            }
                            tokens.push(getToken(comment, TokenType.Comment, line, column - comment.length));
                        } else if (input[position + 1] === '*') {
                            let comment = '';
                            position += 2;
                            column += 2;
                            while (position < length && !(input[position] === '*' && input[position + 1] === '/')) {
                                comment += input[position];
                                if (newLine(input[position])) {
                                    line++;
                                    column = 0;
                                }
                                position++;
                                column++;
                            }
                            position += 2;
                            column += 2;
                            tokens.push(getToken(comment, TokenType.Comment, line, column - comment.length));
                        } else {
                            tokens.push(getToken(char, TokenType.BinaryOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '=':
                        if (input[position + 1] === '=') {
                            tokens.push(getToken('==', TokenType.ComparisonOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.Operator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '!':
                        if (input[position + 1] === '=') {
                            tokens.push(getToken('!=', TokenType.ComparisonOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.LogicalOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '<':
                        if (input[position + 1] === '=') {
                            tokens.push(getToken('<=', TokenType.ComparisonOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.ComparisonOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '>':
                        if (input[position + 1] === '=') {
                            tokens.push(getToken('>=', TokenType.ComparisonOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.ComparisonOperator, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '&':
                        if (input[position + 1] === '&') {
                            tokens.push(getToken('&&', TokenType.LogicalOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.Unknown, line, column));
                            position++;
                            column++;
                        }
                        break;
                    case '|':
                        if (input[position + 1] === '||') {
                            tokens.push(getToken('||', TokenType.LogicalOperator, line, column));
                            position += 2;
                            column += 2;
                        } else {
                            tokens.push(getToken(char, TokenType.Unknown, line, column));
                            position++;
                            column++;
                        }
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
                    case '{':
                        tokens.push(getToken(char, TokenType.BraceLeft, line, column));
                        position++;
                        column++;
                        break;
                    case '}':
                        tokens.push(getToken(char, TokenType.BraceRight, line, column));
                        position++;
                        column++;
                        break;
                    case ',':
                        tokens.push(getToken(char, TokenType.Comma, line, column));
                        position++;
                        column++;
                        break;
                    case ';':
                        tokens.push(getToken(char, TokenType.Semicolon, line, column));
                        position++;
                        column++;
                        break;
                    case ':':
                        tokens.push(getToken(char, TokenType.Colon, line, column));
                        position++;
                        column++;
                        break;
                    case '.':
                        tokens.push(getToken(char, TokenType.Dot, line, column));
                        position++;
                        column++;
                        break;
                    default:
                        tokens.push(getToken(char, TokenType.Unknown, line, column));
                        position++;
                        column++;
                        break;
                }
                break;
        }

    }
    
    tokens.push({ value: "", type: TokenType.EOF, line, column });
    return tokens;
};

// Example usage
const sourceCode = `let x = 60 + -> <= (hi*tushar) let str = "hello world"`;
const tokens = Tokenize(sourceCode);
tokens.forEach(token => {
    console.log(`Token Type: ${TokenType[token.type]}, Value: '${token.value}', Line: ${token.line}, Column: ${token.column}`);
});