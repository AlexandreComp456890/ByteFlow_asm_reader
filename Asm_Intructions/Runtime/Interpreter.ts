import { InstructionSet } from "./IntructionsSet";
import { ExecutionContext } from "./ExecutionContext";

export class Interpreter {
  private instructionSet = new InstructionSet();
  private context = new ExecutionContext();

  run(lines: string[]): void {
    for (let line of lines) {
      this.context.currentLine = line;
      const instr = this.instructionSet.findMatchingInstruction(line);
      if (instr) {
        instr.execute(this.context);
      } else {
        console.warn(`Unrecognized instruction: ${line}`);
      }
    }

    for(const register in this.context.registers){
      console.log(`${register}:${ExecutionContext.fixToHex(this.context.getRegister(register))}`);
    } // Debug output
  }
}