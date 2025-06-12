import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class LoadWord implements IInstruction {
    //lw $t0, 
    private regex = /^\s*(?:(\w+):)?\s*lw\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest, src1, src2] = match;
        const val1 = Number(src1);
        const val2 = context.getRegister(src2);
        const newContext = context.getMemory(val2 + val1);

        if (newContext === null) return;

        context.setRegister(dest, newContext);

        
        context.encodedInst = this.encondingForTheHolyMachine({registers: context.registers, rs: src2, rt: dest, immediate: val1})
       
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "100011";
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