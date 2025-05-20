import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Add_Immediate implements IInstruction {
    private regex = /^\s*addi\s+\$(\w+),\s*\$(\w+),\s*(\w+)\s*$/i;

    match(line: string): boolean {
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = Number(src2);
        context.setRegister(dest, val1 + val2);
    }
}