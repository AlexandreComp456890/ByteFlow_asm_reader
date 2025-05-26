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
        const addressOffset = val1 >= 4 ? (Number(src1)/4|0) *4 : 0;
        const newContext = context.getMemory(val2 + addressOffset);

        context.setRegister(dest, this.halfWord(newContext, val1 % 4|0));
        
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