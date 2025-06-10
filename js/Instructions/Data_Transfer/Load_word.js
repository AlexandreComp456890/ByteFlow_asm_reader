import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class LoadWord {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*lw\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
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
        const newContext = context.getMemory(val2 + val1);
        if (newContext === null)
            return;
        context.setRegister(dest, newContext);
        console.log(`\n${ExecutionContext.fixToHex(this.encondingForTheHolyMachine({ registers: context.registers, rs: src2, rt: dest, immediate: val1 }))}\n`);
    }
    encondingForTheHolyMachine(params) {
        // Type I
        const opcode = "100011";
        const registerValue = Object.keys(params.registers);
        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');
        return parseInt((opcode + rs + rt + immediate), 2);
    }
}
