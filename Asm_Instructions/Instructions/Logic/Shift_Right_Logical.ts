import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Shift_Right_Logical implements IInstruction {
    //lw $t0, 
    private regex = /^\s*(?:(\w+):)?\s*srl\s+\$(\w+),\s*\$(\w+),\s*([-+]?\w+)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = Number(src2);
        
        context.setRegister(dest, val1 >> val2);
        
        context.encodedInst = this.encondingForTheHolyMachine({registers: context.registers, rt: src1, shamt: val2, rd: dest});
    }

    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, shamt: number, rd: string}): number {
        const opcode = "000000";
        const funct = "000010";
        const registerValue = Object.keys(params.registers);

        const rs = "00000";
        const rt = registerValue.indexOf(params.rt).toString(2).padStart(5, '0');
        const rd = registerValue.indexOf(params.rd).toString(2).padStart(5, '0');

        const shamt: string = params.shamt.toString(2).padStart(5, '0');
        // opcode for Type R will always be 0x00
        return parseInt((opcode + rs + rt + rd + shamt + funct),2)
    }

    instructionType(): string {
        return "R";
    }
}