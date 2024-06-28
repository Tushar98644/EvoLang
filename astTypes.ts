export type NodeType = "Program" | "Identifier" | "NumericLiteral" | "BinaryExp";

export interface stmt {
  kind : NodeType;
}

export interface Program extends stmt{
    kind: "Program";
    body: stmt[];
}

export interface Exp extends stmt{};

export interface BinaryExp extends Exp{
    kind: "BinaryExp";
    operator: string;
    left: Exp;
    right: Exp;
}

export interface Identifier extends Exp{
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Exp{
    kind: "NumericLiteral";
    value: number;
}
