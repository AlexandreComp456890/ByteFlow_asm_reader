import { InstructionSet } from "./IntructionsSet";
import { ExecutionContext } from "./ExecutionContext";
import { Literal_Control } from "../Instructions/Literal_Control";

export class Interpreter {
  private instructionSet = new InstructionSet();
  private context = new ExecutionContext();

  run(lines: string[]): void {
    let auxPC: number;
    this.parserProgram(lines);
    console.log("------------------------------------------------------------------------");
    console.log("Executer Runner:\n");
    while (true) {
        auxPC = ExecutionContext.programCounter; // Update auxPC to reflect the current program counter
        const line: string = this.context.allLines[auxPC];
        if(line === undefined) break;                                                                //Find another method to check end of runtime
        this.context.currentLine = line;
        const instr = this.instructionSet.findMatchingInstruction(line);
        console.log(`\t${ExecutionContext.fixToHex(auxPC)} | ${line}`);
        if (instr) {
            instr.execute(this.context);
            ExecutionContext.programCounter += 4
        }
    }
    console.log("------------------------------------------------------------------------");
    for (const register in this.context.registers) {
        console.log(`${register}:${ExecutionContext.fixToHex(this.context.getRegister(register))}`);
    } // Debug output
}

  private parserProgram(lines: string[]): void{
    console.log("------------------------------------------------------------------------");
    console.log("Parser Runner:\n");
    let pc: number = ExecutionContext.programCounter
    for (let line of lines) {
      if (line === undefined || line === "") continue;                                    //Case there is whitespace
      this.context.currentLine = line;
      const instr = this.instructionSet.findMatchingInstruction(line);
      if (instr) {
        if (instr instanceof Literal_Control){
          instr.execute(this.context, pc);
        }else{
          this.context.allLines[pc] = line;
          console.log(`\t${ExecutionContext.fixToHex(pc)} | ${this.context.allLines[pc]}`);
          pc += 4;
        }
      }else {
        console.log("------------------------------------------------------------------------");
        console.warn(`Unrecognized instruction: ${line} at ${ExecutionContext.fixToHex(pc)}.\nOperation ended in runtime error.`);
        break;
      }
    }
    console.log("------------------------------------------------------------------------");
    console.log(`Execution finished. Program Counter: ${ExecutionContext.fixToHex(pc)}`);
  }
}