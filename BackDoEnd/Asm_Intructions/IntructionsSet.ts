import { IInstruction } from "./Instructions/IInstructions";
import { Add } from "./Instructions/Add";
// import other instructions...

export class InstructionSet {
  private instructions: IInstruction[] = [
    new Add(),
    // add other instructions
  ];

  findMatchingInstruction(line: string): IInstruction | null {
    return this.instructions.find(instr => instr.match(line)) || null;
  }
}
