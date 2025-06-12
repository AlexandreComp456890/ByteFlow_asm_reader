import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Or_immediate implements IInstruction {
    //lw $t0, 
    private regex = /^\s*(?:(\w+):)?\s*ori\s+\$(\w+),\s*\$(\w+),\s*([-+]?\w+)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = Number(src2);
        
        context.setRegister(dest, (val1 | val2) >>> 0);

        
        context.encodedInst = this.encondingForTheHolyMachine({registers: context.registers, rs: src1, rt: dest, immediate: val2})
        
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "001101";
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