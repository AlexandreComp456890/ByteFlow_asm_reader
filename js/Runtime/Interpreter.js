import { InstructionSet } from "./IntructionsSet.js";
import { ExecutionContext } from "./ExecutionContext.js";
import { Literal_Control } from "../Instructions/Literal_Control.js";
export class Interpreter {
    constructor(lines) {
        this.instructionSet = new InstructionSet();
        this.context = new ExecutionContext();
        this.currentEncodedInst = 0;
        this.typeOfInstr = ""
        this.didRun = this.parserProgram(lines);
    }
    
    run() {
        if (!this.didRun)
            return;
        let auxPC;
        while (true) {
            auxPC = ExecutionContext.programCounter; // Update auxPC to reflect the current program counter
            const line = this.context.allLines[auxPC];
            this.context.currentLine = line;
            const instr = this.instructionSet.findMatchingInstruction(line);
            if (instr) {
                this.typeOfInstr = instr.instructionType();
                this.currentEncodedInst = this.context.encodedInst;
                instr.execute(this.context);
                ExecutionContext.programCounter += 4;
            }
            if (line === undefined){
                ExecutionContext.programCounter += 4;
                break; //Find another method to check end of runtime
            }
        }
    }

    stepInto() {
        if (!this.didRun)
            return {done: true, error: "Program not loaded or failed to parse"};
        const pc = ExecutionContext.programCounter;
        const line = this.context.allLines[pc];
        
        this.context.currentLine = line;
        const instr = this.instructionSet.findMatchingInstruction(line);
        
        if (instr) {
            instr.execute(this.context);
            this.currentEncodedInst = this.context.encodedInst;
            this.typeOfInstr = instr.instructionType();
            ExecutionContext.programCounter += 4;
            
            return {done: false};
        }
        if (this.context.allLines[ExecutionContext.programCounter] === undefined){
            ExecutionContext.programCounter += 4;
            return { done: true };
        }
        
        return {
            done: true,
            error: `Invalid instruction at PC=${pc}: ${line}`
        };
    }

    parserProgram(lines) {
        const commentPattern = /^\s*#.*$/i
        let pc = ExecutionContext.programCounter;
        for (let line of lines) {
            if (line === undefined || line.trim() === "" || commentPattern.test(line))
                continue; //Case there is whitespace
            this.context.currentLine = line;
            const instr = this.instructionSet.findMatchingInstruction(line);
            const isLabel = this.instructionSet.findLabel(line);
            if (instr) {
                if (isLabel) {
                    isLabel.execute(this.context, pc);
                    if (!(instr instanceof Literal_Control)) {
                        this.context.allLines[pc] = line;
                        pc += 4;
                    } // Any instruction runs before Literal_Control, in case it is a conjoint instruction (Label + Instruction).
                    // Yes, it's a scuffed way of doing it. Currently working on a better method. 
                }
                else {
                    this.context.allLines[pc] = line;
                    pc += 4;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }
}
