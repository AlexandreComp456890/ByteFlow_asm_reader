export class LoadImmediate{
    constructor() {
        //lw $t0, 
        this.regex = /^\s*(?:(\w+):)?\s*li\s+\$(\w+),\s*([-+]?\w+)\s*(?:#\s*(.*))?$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        const [, , dest, src1] = match;
        const val1 = Number(src1);
        //Control variable to facilitate the half word
        context.setRegister(dest, val1);
        context.encodedInst = this.encondingForTheHolyMachine({ registers: context.registers, rt: dest, immediate: val1 });
    }
    encondingForTheHolyMachine(params) {
        // Type I
        const opcode = "001001";
        const registerValue = Object.keys(params.registers);
        const rs = "00000";
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');
        return parseInt((opcode + rs + rt + immediate), 2);
    }
    instructionType() {
        return "I";
    }
}