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
     * @param programCounter (optinal) number
     * @returns void
     */
    execute(context: ExecutionContext, programCounter?: number): void;

    /**
     * @description Returns the 32-bit word of the instruction.
     * Used for instruction encoding to machine code.
     * @return number
     */
    encondingForTheHolyMachine(params :
        {registers?: Record<string,number>, rs?: string, rt?: string, rd?: string, shamt?: number, immediate?: number, target?: number}): number | number[];
}
