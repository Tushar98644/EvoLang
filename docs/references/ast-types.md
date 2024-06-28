# AST Types in TypeScript

## NodeType

```typescript
export type NodeType =
  | "Program"
  | "Identifier"
  | "NumericLiteral"
  | "BinaryExp";
```

This is a union type that lists all possible kinds of nodes in the AST. Each kind corresponds to a specific type of syntax element in the language.

## Stmt

```typescript
export interface stmt {
  kind: NodeType;
}
```

This is an interface that represents a statement in the AST. It has a `kind` property that specifies the type of the statement.The statement

## Program

```typescript
export interface Program extends stmt {
  kind: "Program";
  body: stmt[];
}
```

This interface represents the root node of the AST, which contains the entire program.

## Expression

```typescript
export interface exp extends stmt {}
```

This interface represents an expression in the AST. An expression is a piece of code that produces a value.

## BinaryExp

```typescript
export interface BinaryExp extends exp {
  kind: "BinaryExp";
  operator: string;
  left: exp;
  right: exp;
}
```

A binary expression is an expression that consists of two operands and an operator.

## Identifier

```typescript
export interface Identifier extends exp {
  kind: "Identifier";
  name: string;
}
```

An identifier is a name that refers to a variable, function, or other entity in the program.

## NumericLiteral

```typescript
export interface NumericLiteral extends exp {
  kind: "NumericLiteral";
  value: number;
}
```

A numeric literal is a literal value that represents a number in the program.

## Example AST

An example AST for a simple program that assigns a value to a variable and then adds 1 to it:

```typescript
const exampleAST: Program = {
  kind: "Program",
  body: [
    {
      kind: "AssignmentExp",
      left: {
        kind: "Identifier",
        symbol: "a",
      },
      right: {
        kind: "NumericLiteral",
        value: 1,
      }
    },
    {
      kind: "BinaryExp",
      operator: "+",
      left: {
        kind: "Identifier",
        symbol: "a",
      },
      right: {
        kind: "NumericLiteral",
        value: 1,
      }
    }
  ]
};

console.log(exampleAST);
```