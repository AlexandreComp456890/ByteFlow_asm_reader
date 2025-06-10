import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class Jump_And_Link {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*jal\s+(\w+)$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        const [, dest] = match;
        const address = context.literals[dest];
        context.registers.ra = ExecutionContext.programCounter + 4;
        if (address !== undefined) {
            // Update the global program counter to jump to the label
            ExecutionContext.programCounter = address - 4;
            console.log(`\nJumping to label ${dest} at ${ExecutionContext.fixToHex(address)}. $ra = ${ExecutionContext.fixToHex(context.registers.ra)}\n`);
            console.log(`${ExecutionContext.fixToHex(this.encondingForTheHolyMachine({ target: address >>> 2 }))}\n`);
            return;
        }
        console.warn(`\nLabel ${dest} not found. Runtime error.\n`);
    }
    encondingForTheHolyMachine(params) {
        // Type J
        const opcode = "000011";
        const target = (params.target & 0x03FFFFFF).toString(2).padStart(26, '0');
        return parseInt(opcode + target, 2);
    }
}
