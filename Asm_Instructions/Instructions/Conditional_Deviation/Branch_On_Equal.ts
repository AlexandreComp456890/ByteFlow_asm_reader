import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Branch_On_Equal implements IInstruction {
    //lw $t0, 
    private regex = /^\s*beq\s+\$(\w+),\s*\$(\w+),\s*(\w+)\s*$/i

    match(line: string): boolean{
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, src1, src2, dest] = match;
        const val1 = context.getRegister(src1);
        const val2 = context.getRegister(src2);
        
        const literalKeys = Object.keys(context.literals);
        const literalIndex = literalKeys.indexOf(dest) + 1;

        if (val1 === val2) {
            const address = context.literals[dest] - 4;
            if (address !== undefined) {
                // Update the global program counter to jump to the label
                ExecutionContext.programCounter = address;         
                console.log(`\nBranching to label ${dest} at ${ExecutionContext.fixToHex(address + 4)}`);
            } else {
                console.warn(`\nLabel ${dest} not found. Runtime error.`);
            }
        } else {
            // If condition is false, continue to the next instruction
            console.log("\nCondition failed, continuing to the next instruction.");
        }
        console.log(`${ExecutionContext.fixToHex(
            this.encondingForTheHolyMachine({registers: context.registers, rs: src1, rt: src2, immediate: literalIndex}))}\n`
        );
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number {
        // Type I
        const opcode = "000100";
        const registerValue = Object.keys(params.registers);

        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        const immediate = params.immediate.toString(2).padStart(16, '0');

        return parseInt((opcode + rs + rt + immediate),2);
    }
}