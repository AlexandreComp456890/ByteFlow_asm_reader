import { InstructionSet } from "./IntructionsSet.js";
import { ExecutionContext } from "./ExecutionContext.js";
import { Literal_Control } from "../Instructions/Literal_Control.js";
export class Interpreter {
    constructor() {
        this.instructionSet = new InstructionSet();
        this.context = new ExecutionContext();
    }
    run(lines) {
        let auxPC;
        this.parserProgram(lines);
        console.log("------------------------------------------------------------------------");
        console.log("Executer Runner:\n");
        while (true) {
            auxPC = ExecutionContext.programCounter; // Update auxPC to reflect the current program counter
            const line = this.context.allLines[auxPC];
            if (line === undefined)
                break; //Find another method to check end of runtime
            this.context.currentLine = line;
            const instr = this.instructionSet.findMatchingInstruction(line);
            console.log(`\t${ExecutionContext.fixToHex(auxPC)} | ${line}`);
            if (instr) {
                instr.execute(this.context);
                ExecutionContext.programCounter += 4;
            }
        }
        console.log("------------------------------------------------------------------------");
        for (const register in this.context.registers) {
            console.log(`${register}:${ExecutionContext.fixToHex(this.context.getRegister(register))}`);
        } // Debug output
    }
    parserProgram(lines) {
        console.log("------------------------------------------------------------------------");
        console.log("Parser Runner:\n");
        let pc = ExecutionContext.programCounter;
        for (let line of lines) {
            if (line === undefined || line === "")
                continue; //Case there is whitespace
            this.context.currentLine = line;
            const instr = this.instructionSet.findMatchingInstruction(line);
            if (instr) {
                if (instr instanceof Literal_Control) {
                    instr.execute(this.context, pc);
                }
                else {
                    this.context.allLines[pc] = line;
                    console.log(`\t${ExecutionContext.fixToHex(pc)} | ${this.context.allLines[pc]}`);
                    pc += 4;
                }
            }
            else {
                console.log("------------------------------------------------------------------------");
                console.warn(`Unrecognized instruction: ${line} at ${ExecutionContext.fixToHex(pc)}.\nOperation ended in runtime error.`);
                break;
            }
        }
        console.log("------------------------------------------------------------------------");
        console.log(`Execution finished. Program Counter: ${ExecutionContext.fixToHex(pc)}`);
    }
}
