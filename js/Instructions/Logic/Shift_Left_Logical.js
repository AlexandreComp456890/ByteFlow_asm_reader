export class Shift_Left_Logical {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*sll\s+\$(\w+),\s*\$(\w+),\s*([-+]?\w+)\s*$/i;
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
        context.setRegister(dest, val1 << val2);
        console.log(`Executing LEFT SHIFT: ${val1.toString(2).padStart(32, '0')} after SHIFT ${context.getRegister(dest).toString(2).padStart(32, '0')}`);
        this.encondingForTheHolyMachine({ registers: context.registers, rt: src1, shamt: val2, rd: dest });
    }
    encondingForTheHolyMachine(params) {
        const opcode = "000000";
        const funct = "000000";
        const registerValue = Object.keys(params.registers);
        const rs = "00000";
        const rt = registerValue.indexOf(params.rt).toString(2).padStart(5, '0');
        const rd = registerValue.indexOf(params.rd).toString(2).padStart(5, '0');
        const shamt = params.shamt.toString(2).padStart(5, '0');
        // opcode for Type R will always be 0x00
        return parseInt((opcode + rs + rt + rd + shamt + funct), 2);
    }
}
