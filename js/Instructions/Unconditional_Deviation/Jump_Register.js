import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class Jump_Register {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*(?:(\w+):)?\s*jr\s+\$(\w+)\s*(?:#\s*(.*))?$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        const [, , dest] = match;
        const address = context.getRegister(dest);
        if (address >= 0x00400000 && address <= 0x004FFFFF) {
            if (address !== undefined) {
                // Update the global program counter to jump to the label
                ExecutionContext.programCounter = address - 4;
                return;
            }
            console.error(`\nLabel ${dest} not found. Runtime error.\n`);
            return;
        }
        console.error(`\n${ExecutionContext.fixToHex(address)} isn't a valid Program Counter address. Error at line ${match[0]}.\n`);
        context.encodedInst = this.encondingForTheHolyMachine({ registers: context.registers, rs: dest });
    }
    encondingForTheHolyMachine(params) {
        //this jump instruction is type R, which means, opcode = 0x00
        const opcode = "000000";
        const funct = "001000";
        const registerValue = Object.keys(params.registers);
        const rs = registerValue.indexOf(params.rs).toString(2).padStart(5, '0');
        ;
        const rt = "00000";
        const rd = "00000";
        const shamt = "00000";
        // opcode for Type R will always be 0x00
        return parseInt((opcode + rs + rt + rd + shamt + funct), 2);
    }
    instructionType() {
        return "R";
    }
}
