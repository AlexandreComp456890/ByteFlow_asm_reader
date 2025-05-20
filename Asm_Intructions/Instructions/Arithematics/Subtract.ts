import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Subtract implements IInstruction {
    private regex = /^\s*sub\s+\$(\w+),\s*\$(\w+),\s*\$(\w+)\s*$/i;

    match(line: string): boolean {
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = context.getRegister(src2);
        context.setRegister(dest, val1 - val2);
    }
}