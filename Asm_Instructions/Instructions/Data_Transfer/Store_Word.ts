import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class StoreWord implements IInstruction {
    private regex = /^\s*(?:(\w+):)?\s*sw\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest, src1, src2] = match;
        const val1 = Number(src1);
        const val2 = context.getRegister(src2);

        if (val1 % 4 !== 0) return;
        context.setMemory(val2 + val1, context.getRegister(dest));

        context.encodedInst = this.encondingForTheHolyMachine({registers: context.registers, rs: src2, rt: dest, immediate: val1})
        
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "101011";
        const registerValue = Object.keys(params.registers);

        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');

        return parseInt((opcode + rs + rt + immediate),2);
    }

    instructionType(): string {
        return "I";
    }
}