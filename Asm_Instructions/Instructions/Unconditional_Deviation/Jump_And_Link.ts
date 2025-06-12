import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Jump_And_Link implements IInstruction {
    //lw $t0, 
    private regex = /^\s*(?:(\w+):)?\s*jal\s+(\w+)\s*(?:#\s*(.*))?$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest] = match;
    
        const address = context.literals[dest];
        context.registers.ra = ExecutionContext.programCounter + 4;

        if (address !== undefined) {
            // Update the global program counter to jump to the label
            ExecutionContext.programCounter = address - 4;
            context.encodedInst = this.encondingForTheHolyMachine({target: address >>> 2})
            
            return;
        }
        console.error(`\nLabel ${dest} not found. Runtime error.\n`);
        
    }
        
    encondingForTheHolyMachine(params: {target: number}): number {
        // Type J
        const opcode = "000011";
        const target = (params.target & 0x03FFFFFF).toString(2).padStart(26, '0');

        return parseInt(opcode + target, 2);
    }

    instructionType(): string {
        return "J";
    }
}