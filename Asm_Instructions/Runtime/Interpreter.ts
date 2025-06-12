import { InstructionSet } from "./IntructionsSet";
import { ExecutionContext } from "./ExecutionContext";
import { Literal_Control } from "../Instructions/Literal_Control";

export class Interpreter {
  private instructionSet = new InstructionSet();
  private context = new ExecutionContext();
  currentEncodedInst: number | number[] = 0;

  run(lines: string[]): void {
    let auxPC: number;
    const didRun = this.parserProgram(lines);
    if (!didRun) return;
    while (true) {
        auxPC = ExecutionContext.programCounter; // Update auxPC to reflect the current program counter
        const line: string = this.context.allLines[auxPC];
        if(line === undefined) break;                                                                //Find another method to check end of runtime
        this.context.currentLine = line;
        const instr = this.instructionSet.findMatchingInstruction(line);
        if (instr) {
            instr.execute(this.context);
            this.currentEncodedInst = this.context.encodedInst;
            ExecutionContext.programCounter += 4
        }
    }
}

  private parserProgram(lines: string[]): boolean{
    let pc: number = ExecutionContext.programCounter
    for (let line of lines) {
      if (line === undefined || line.trim() === "") continue;                                    //Case there is whitespace
      this.context.currentLine = line;
      const instr = this.instructionSet.findMatchingInstruction(line);
      const isLabel = this.instructionSet.findLabel(line);
      if (instr) {
        if (isLabel){
          isLabel.execute(this.context, pc);
          if (!(instr instanceof Literal_Control)){
            this.context.allLines[pc] = line;
            pc += 4;
          } // Any instruction runs before Literal_Control, in case it is a conjoint instruction (Label + Instruction).
          // Yes, it's a scuffed way of doing it. Currently working on a better method. 
        }else{
          this.context.allLines[pc] = line;
          pc += 4;
        }
      }else {
        return false;
      }
    }
    return true;
  }
}