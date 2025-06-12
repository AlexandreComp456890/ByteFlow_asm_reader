import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class StoreHalf implements IInstruction {
    //lw $t0, 
    private regex = /^\s*(?:(\w+):)?\s*sh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest, src1, src2] = match;
        const val1 = Number(src1);
        const val2 = context.getRegister(src2);

        //Control variable to facilitate the half word
        const addressOffset1 = val1 % 4 === 0 ? ((val1 / 4 | 0) * 4) : 0;
        const addressOffset2 = val1 % 4;
        const newContext = context.getRegister(dest);

        context.setMemory(val2 + addressOffset1, this.halfWord(newContext, addressOffset2|0));
        if (val1 % 2 !== 0) return;
        
        
        context.encodedInst = this.encondingForTheHolyMachine({registers: context.registers, rs: src2, rt: dest, immediate: val1})
        
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "101001";
        const registerValue = Object.keys(params.registers);

        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');

        return parseInt((opcode + rs + rt + immediate),2);
    }

    instructionType(): string {
        return "I";
    }

    /**
     * @description Splices the parameter value to 16 bits/2 bytes/half word and returns it.
     * @param value number or null
     * @returns If value is null, returns 0.
     * If value > 0xFFFF = 65535, returns the last half of the value.
     */
    private halfWord(value: number | null, offset: number): number{
        if (value === null) return 0;
        let mask: string = ExecutionContext.fixToHex(value);
        const realOffset = 4 - offset*2;

        mask = mask.slice(mask.length - 4, mask.length);

        let pattern = "00000000".split("");
        for (let i = realOffset; i < realOffset + 4; i++) 
            pattern[i] = mask[i - realOffset];

        value = parseInt(pattern.toString().replace(/[!.,]/g, ''), 16);
        return value;
    }
}