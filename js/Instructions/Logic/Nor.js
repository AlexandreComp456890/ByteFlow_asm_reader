export class Nor {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*nor\s+\$(\w+),\s*\$(\w+),\s*\$(\w+)\s*$/i;
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
        const val2 = context.getRegister(src2);
        // NOR operation is equivalent to NOT (A OR B)
        // Using bytewise NOT (~) and OR (|)
        context.setRegister(dest, (~(val1 | val2)) >>> 0);
        this.encondingForTheHolyMachine({ registers: context.registers, rs: src1, rt: src2, rd: dest });
    }
    encondingForTheHolyMachine(params) {
        // opcode 0x00 for type R
        const opcode = "000000";
        const funct = "100111";
        const registerValue = Object.keys(params.registers);
        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const rd = (registerValue.indexOf(params.rd)).toString(2).padStart(5, '0');
        const shamt = "00000";
        return parseInt((opcode + rs + rt + rd + shamt + funct), 2);
    }
}
