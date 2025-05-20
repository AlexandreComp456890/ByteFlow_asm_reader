import { ExecutionContext } from "../Runtime/ExecutionContext";

export interface IInstruction {
    match(line: string): boolean;
    execute(context: ExecutionContext): void;
}
