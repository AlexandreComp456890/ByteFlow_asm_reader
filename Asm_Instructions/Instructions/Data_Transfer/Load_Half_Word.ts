import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class LoadHalf implements IInstruction {
    //lw $t0, 
    private regex = /^\s*lh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, dest, src1, src2] = match;
        const val1 = Number(src1);
        const val2 = context.getRegister(src2);

        //Control variable to facilitate the half word
        const addressOffset1 = val1 >= 4 ? (Number(src1)/4|0) *4 : 0;
        const addressOffset2 = val1 % 4;
        const trueAddressOffset = addressOffset1 + addressOffset2;
        const newContext = context.getMemory(val2 + trueAddressOffset);

        if (newContext === null) return;

        context.setRegister(dest, this.halfWord(newContext, val1 % 4|0));

        console.log(`\n${ExecutionContext.fixToHex(
            this.encondingForTheHolyMachine({registers: context.registers, rs: src2, rt: dest, immediate: val1}))}\n`
        );
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "100001";
        const registerValue = Object.keys(params.registers);

        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');

        return parseInt((opcode + rs + rt + immediate),2);
    }

    //Splices the parameter value to 16 bits/2 bytes/half word and returns it
    //if value null, returns 0J
    private halfWord(value: number | null, offset: number): number{
        if (value === null) return 0;
        let mask: string = ExecutionContext.fixToHex(value);
        const realOffset = offset*2;

        mask = mask.slice((mask.length -4) - realOffset, (mask.length) - realOffset);

        value = parseInt(mask.toString().replace(/[!.,]/g, ''), 16);
        return value;
    }
}