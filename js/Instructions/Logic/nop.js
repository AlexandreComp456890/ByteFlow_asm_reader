export class NOP {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*(?:(\w+):)?\s*nop\s*(?:#\s*(.*))?$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        context.encodedInst = this.encondingForTheHolyMachine();
    }
    encondingForTheHolyMachine() {
        // opcode 0x00 for type R
        return 0;
    }
    instructionType() {
        return "R";
    }
}