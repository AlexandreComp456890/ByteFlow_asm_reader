import { ExecutionContext } from "../Runtime/ExecutionContext.js";
export class Literal_Control {
    constructor() {
        //lw $t0, 
        this.regex = /^\s*([A-Z0-9_]+):\s*(.*)?$/i;
    }
    match(line) {
        return this.regex.test(line);
    }
    execute(context, programCounter) {
        const match = this.regex.exec(context.currentLine);
        if (!match)
            return;
        console.log(`${match[1]} | ${ExecutionContext.fixToHex(programCounter)}`);
        context.literals[match[1]] = programCounter;
    }
    encondingForTheHolyMachine() {
        return 0b00000000;
    }
    instructionType() {
        return "N/A";
    }
}
