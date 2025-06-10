import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class And_immediate {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*andi\s+\$(\w+),\s*\$(\w+),\s*([-+]?\w+)\s*$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        const [, dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = Number(src2);
        context.setRegister(dest, (val1 & val2) >>> 0);
        console.log(`\n${ExecutionContext.fixToHex(this.encondingForTheHolyMachine({ registers: context.registers, rs: src1, rt: dest, immediate: val2 }))}\n`);
    }
    encondingForTheHolyMachine(params) {
        // Type I
        const opcode = "001100";
        const registerValue = Object.keys(params.registers);
        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');
        return parseInt((opcode + rs + rt + immediate), 2);
    }
}
