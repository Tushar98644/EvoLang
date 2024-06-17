export type NodeType = "Program" | "Identifier" | "NumericLiteral" | "BinaryExp";
// This is a union type that lists all possible kinds of nodes in the AST. Each kind corresponds to a specific type of syntax element in the language.


// This is the base interface for all nodes in the AST.
export interface stmt {
  kind : NodeType;
}

// This interface represents the root node of the AST, which contains the entire program.
export interface Program extends stmt{
    kind: "Program";
    body: stmt[];
}

// This interface represents an expression in the AST. Expressions are nodes that produce a value. For example, a binary expression (e.g., addition, subtraction) is an expression because it produces a value by combining two other values.
export interface Exp extends stmt{};

//  This interface represents a binary expression (e.g., addition, subtraction)
export interface BinaryExp extends Exp{
    kind: "BinaryExp";
    operator: string;
    left: Exp;
    right: Exp;
}

// This interface represents an identifier (e.g., variable name)
export interface Identifier extends Exp{
    kind: "Identifier";
    symbol: string;
}

// This interface represents a numeric literal (e.g., 42)
export interface NumericLiteral extends Exp{
    kind: "NumericLiteral";
    value: number;
}
