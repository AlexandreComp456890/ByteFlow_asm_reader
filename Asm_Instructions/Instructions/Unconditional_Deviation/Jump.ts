import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Jump implements IInstruction {
    //lw $t0, 
    private regex = /^\s*(?:(\w+):)?\s*j\s+(\w+)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest] = match;
        
            const address = context.literals[dest];
            if (address !== undefined) {
                // Update the global program counter to jump to the label
                ExecutionContext.programCounter = address - 4;
                console.log(`\nJumping to label ${dest} at ${ExecutionContext.fixToHex(address)}`);
                context.encodedInst = this.encondingForTheHolyMachine({target: address >>> 2})
                return;
            }
            console.error(`\nLabel ${dest} not found. Runtime error.\n`);
            
        }
            
    encondingForTheHolyMachine(params: {target: number}): number {
        // Type J
        const opcode = "000010";
        const target = (params.target & 0x03FFFFFF).toString(2).padStart(26, '0');

        return parseInt(opcode + target, 2);
    }

    instructionType(): string {
        return "J";
    }
}