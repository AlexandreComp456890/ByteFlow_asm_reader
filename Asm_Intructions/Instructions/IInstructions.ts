import { ExecutionContext } from "../Runtime/ExecutionContext";

export interface IInstruction {
    /**
     * @description Matches a line through a difinef pattern.
     * @param line string
     * @returns True if the line matches any instruction pattern, false otherwise.
     */
    match(line: string): boolean;

    /**
     * @description Executes the instruction based on the current context.
     * @param context ExecutionContext
     * @returns void
     */
    execute(context: ExecutionContext): void;
}
