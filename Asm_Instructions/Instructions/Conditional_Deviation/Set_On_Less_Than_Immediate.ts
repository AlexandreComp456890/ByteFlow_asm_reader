import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Set_On_Less_Than_Immediate implements IInstruction {
    //lw $t0, 
    private regex = /^\s*slti\s+\$(\w+),\s*\$(\w+),\s*([-+]?\w+)\s*$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = Number(src2);
        
        if (val2 >= (-32768) && val2 <= 0x7FFF){
            if (val1 < val2) {
                console.log(`\n${val1} < ${val2} = true. ${dest} is now set.`)
                context.setRegister(dest, 1);
            } else {
                console.log(`\n${val1} < ${val2} = false. ${dest} is now clear.`)
                context.setRegister(dest, 0);
            }
            console.log(`${ExecutionContext.fixToHex(
                this.encondingForTheHolyMachine({registers: context.registers, rs: src1, rt: dest, immediate: val2 & 0xFFFF}))}\n`
            );
            return;
        }
        console.log(`\nImmediate limit reached. immediate given: ${ExecutionContext.fixToHex(val2 & 0xFFFF)}. Limit: 0x0000FFFF.\n`)
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "001010";
        const registerValue = Object.keys(params.registers);

        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = (params.immediate).toString(2).padStart(16, '0');

        return parseInt((opcode + rs + rt + immediate),2);
    }
}