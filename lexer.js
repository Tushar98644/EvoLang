"use strict";
exports.__esModule = true;
exports.Tokenize = exports.getToken = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Operator"] = 1] = "Operator";
    TokenType[TokenType["Identifier"] = 2] = "Identifier";
    TokenType[TokenType["Keyword"] = 3] = "Keyword";
    TokenType[TokenType["String"] = 4] = "String";
    TokenType[TokenType["Whitespace"] = 5] = "Whitespace";
    TokenType[TokenType["Newline"] = 6] = "Newline";
    TokenType[TokenType["ParenLeft"] = 7] = "ParenLeft";
    TokenType[TokenType["ParenRight"] = 8] = "ParenRight";
    TokenType[TokenType["Unknown"] = 9] = "Unknown";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var getToken = function (value, type, line, column) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type, line: line, column: column };
};
exports.getToken = getToken;
var Tokenize = function (input) {
    var tokens = [];
    var length = input.length;
    var position = 0;
    var line = 1;
    var column = 1;
    var isLetter = function (char) { return /^[a-zA-Z]$/.test(char); };
    var isDigit = function (char) { return /^[0-9]$/.test(char); };
    var isWhitespace = function (char) { return /^\s$/.test(char); };
    var newLine = function (char) { return char === '\n'; };
    while (position < length) {
        var char = input[position];
        // Handle newline
        if (newLine(char)) {
            tokens.push((0, exports.getToken)(char, TokenType.Newline, line, column));
            position++;
            line++;
            column = 1;
            continue;
        }
        // Handle whitespace
        if (isWhitespace(char)) {
            tokens.push((0, exports.getToken)(char, TokenType.Whitespace, line, column));
            position++;
            column++;
            continue;
        }
        // Handle numbers
        if (isDigit(char)) {
            var start = position;
            while (isDigit(input[position])) {
                position++;
                column++;
            }
            var numStr = input.slice(start, position);
            tokens.push((0, exports.getToken)(numStr, TokenType.Number, line, column - numStr.length));
            continue;
        }
        // Handle string literals
        if (char === '"' || char === "'") {
            var str = "";
            var quoteType = char;
            position++; // Remove the opening quote
            column++;
            while (position < length && input[position] !== quoteType) {
                str += input[position];
                position++;
                column++;
            }
            position++; // Remove the closing quote
            column++;
            tokens.push((0, exports.getToken)(str, TokenType.String, line, column - str.length - 2)); // -2 for the quotes
            continue;
        }
        // Handle identifiers and keywords
        if (isLetter(char)) {
            var start = position;
            while (isLetter(input[position]) || isDigit(input[position])) {
                position++;
                column++;
            }
            var idStr = input.slice(start, position);
            var type = (idStr === "let") ? TokenType.Keyword : TokenType.Identifier;
            tokens.push((0, exports.getToken)(idStr, type, line, column - idStr.length));
            continue;
        }
        // Handle operators and punctuation
        switch (char) {
            case '+':
            case '-':
            case '*':
            case '/':
                tokens.push((0, exports.getToken)(char, TokenType.Operator, line, column));
                position++;
                column++;
                break;
            case '(':
                tokens.push((0, exports.getToken)(char, TokenType.ParenLeft, line, column));
                position++;
                column++;
                break;
            case ')':
                tokens.push((0, exports.getToken)(char, TokenType.ParenRight, line, column));
                position++;
                column++;
                break;
            default:
                tokens.push((0, exports.getToken)(char, TokenType.Unknown, line, column));
                position++;
                column++;
                break;
        }
    }
    return tokens;
};
exports.Tokenize = Tokenize;
// Example usage
var sourceCode = "let x = 60 + (hi*tushar) let str = \"hello world\"";
var tokens = (0, exports.Tokenize)(sourceCode);
tokens.forEach(function (token) {
    console.log("Token Type: ".concat(TokenType[token.type], ", Value: '").concat(token.value, "', Line: ").concat(token.line, ", Column: ").concat(token.column));
});
