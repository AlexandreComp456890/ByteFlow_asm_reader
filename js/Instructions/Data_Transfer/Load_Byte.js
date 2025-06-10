import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class LoadByte {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*lb\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        const [, dest, src1, src2] = match;
        const val1 = Number(src1);
        const val2 = context.getRegister(src2);
        //Control variable to facilitate the half word
        const addressOffset = val1 >= 4 ? (Number(src1) / 4 | 0) * 4 : 0;
        const newContext = context.getMemory(val2 + addressOffset);
        context.setRegister(dest, this.byteLoad(newContext, val1 % 4 | 0));
        console.log(`\n${ExecutionContext.fixToHex(this.encondingForTheHolyMachine({ registers: context.registers, rs: src2, rt: dest, immediate: val1 }))}\n`);
    }
    encondingForTheHolyMachine(params) {
        // Type I
        const opcode = "100000";
        const registerValue = Object.keys(params.registers);
        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');
        return parseInt((opcode + rs + rt + immediate), 2);
    }
    /**
     * @description Splices the parameter value to 16 bits/2 bytes/half word and returns it.
     * @param value number or null
     * @returns If value is null, returns 0.
     * If value > 0xFFFF = 65535, returns the last half of the value.
     */
    byteLoad(value, offset) {
        if (value === null)
            return 0;
        let mask = ExecutionContext.fixToHex(value);
        const realOffset = offset * 2;
        mask = mask.slice((mask.length - 2) - realOffset, (mask.length) - realOffset);
        value = parseInt(mask.toString().replace(/[!.,]/g, ''), 16);
        return value;
    }
}
