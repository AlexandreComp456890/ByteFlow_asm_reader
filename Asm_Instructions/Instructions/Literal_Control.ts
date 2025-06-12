import { IInstruction } from "./IInstructions";
import { ExecutionContext } from "../Runtime/ExecutionContext";

export class Literal_Control implements IInstruction {
    //lw $t0, 
    private regex = /^\s*([A-Z0-9_]+):\s*(.*)?$/i;

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext, programCounter: number): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;
        
        
        console.log(`${match[1]} | ${ExecutionContext.fixToHex(programCounter)}`);
        context.literals[match[1]] = programCounter;

    }

    encondingForTheHolyMachine(): number {
        return 0b00000000;
    }

    instructionType(): string {
        return "N/A";
    }
}