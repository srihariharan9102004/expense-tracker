# TypeScript practice

Small practice files, from easy to a little harder. Read them in order.
Each file has comments, `console.log` lines, and a few commented lines that show an **ERROR**
(remove the `//` in front of such a line to see TypeScript complain in your editor).

| File | Topic |
|---|---|
| `01-basic-types.ts` | string, number, boolean, type inference, arrays, tuple |
| `02-functions.ts` | parameter types, return type, default and optional parameters, void |
| `03-interface.ts` | interface, optional property, readonly |
| `04-type-alias-and-union.ts` | type alias, union, literal types, narrowing |
| `05-array-methods.ts` | typed arrays, filter / map / reduce, return an object type |
| `06-generics.ts` | generics `<T>`, `T extends`, generic type |
| `07-undefined-and-enum.ts` | `undefined`, `?.`, `??`, enum |
| `08-class-basics.ts` | class, constructor, private, readonly |
| `09-mini-expense-tracker.ts` | everything together, like the React app |

## Run a file
```bash
npx tsx typescript-practice/01-basic-types.ts
```

## Check the types (this is what TypeScript is really for)
```bash
npx -p typescript tsc -p typescript-practice
```
No output means no type errors.

## Try this
1. In `01-basic-types.ts`, remove `//` from `totalSpent = 'lots'` and read the error.
2. In `04-type-alias-and-union.ts`, remove `//` from the `Games` line.
3. Change one of the files so it breaks on purpose, then fix it.
