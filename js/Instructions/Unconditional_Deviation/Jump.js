import { ExecutionContext } from "../../Runtime/ExecutionContext.js";
export class Jump {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*(?:(\w+):)?\s*j\s+(\w+)\s*(?:#\s*(.*))?$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        const [, , dest] = match;
        const address = context.literals[dest];
        if (address !== undefined) {
            // Update the global program counter to jump to the label
            ExecutionContext.programCounter = address - 4;
            console.log(`\nJumping to label ${dest} at ${ExecutionContext.fixToHex(address)}`);
            context.encodedInst = this.encondingForTheHolyMachine({ target: address >>> 2 });
            return;
        }
        console.error(`\nLabel ${dest} not found. Runtime error.\n`);
    }
    encondingForTheHolyMachine(params) {
        // Type J
        const opcode = "000010";
        const target = (params.target & 0x03FFFFFF).toString(2).padStart(26, '0');
        return parseInt(opcode + target, 2);
    }
    instructionType() {
        return "J";
    }
}
