import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class StoreWord implements IInstruction {
    private regex = /^\s*sw\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, dest, src1, src2] = match;
        const val1 = Number(src1);
        const val2 = context.getRegister(src2);
        context.setMemory(dest, val1 + val2, context.getRegister(dest));
    }
}