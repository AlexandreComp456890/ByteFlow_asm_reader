import { InstructionSet } from "./IntructionsSet";
import { ExecutionContext } from "./Runtime/ExecutionContext";

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

    console.log(this.context.registers); // Debug output
  }
}