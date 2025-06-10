import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class StoreHalf {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*sh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
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
        const addressOffset1 = val1 >= 4 ? (Number(src1) / 4 | 0) * 4 : 0;
        const addressOffset2 = val1 % 4;
        const trueAddressOffset = addressOffset1 + addressOffset2;
        const newContext = context.getRegister(dest);
        context.setMemory(val2 + trueAddressOffset, this.halfWord(newContext, val1 % 4 | 0));
        if (val1 % 2 !== 0)
            return;
        console.log(`\n${ExecutionContext.fixToHex(this.encondingForTheHolyMachine({ registers: context.registers, rs: src2, rt: dest, immediate: val1 }))}\n`);
    }
    encondingForTheHolyMachine(params) {
        // Type I
        const opcode = "101001";
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
    halfWord(value, offset) {
        if (value === null)
            return 0;
        let mask = ExecutionContext.fixToHex(value);
        const realOffset = 4 - offset * 2;
        mask = mask.slice(mask.length - 4, mask.length);
        let pattern = "00000000".split("");
        for (let i = realOffset; i < realOffset + 4; i++)
            pattern[i] = mask[i - realOffset];
        value = parseInt(pattern.toString().replace(/[!.,]/g, ''), 16);
        return value;
    }
}
