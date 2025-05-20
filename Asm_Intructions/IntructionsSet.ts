import { IInstruction } from "./Instructions/IInstructions";
import { Add } from "./Instructions/Arithematics/Add";
import { Subtract } from "./Instructions/Arithematics/Subtract";
import { Add_Immediate } from "./Instructions/Arithematics/Add_Immediate";
import { LoadWord } from "./Instructions/Data_Transfer/Load_word";
import { StoreWord } from "./Instructions/Data_Transfer/Store_Word";
// import other instructions...
export class InstructionSet {
  private instructions: IInstruction[] = [
    //Arithematics
    new Add(),
    new Subtract(),
    new Add_Immediate(),
    //Data Transfer
    new LoadWord(),
    new StoreWord(),
  ];

  findMatchingInstruction(line: string): IInstruction | null {
    return this.instructions.find(instr => instr.match(line)) || null;
  }
}
