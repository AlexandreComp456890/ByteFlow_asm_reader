//All Instructions calls
//Interface
import { IInstruction } from "../Instructions/IInstructions";
//Arithematic Instructions
import { Add } from "../Instructions/Arithematics/Add";
import { Subtract } from "../Instructions/Arithematics/Subtract";
import { Add_Immediate } from "../Instructions/Arithematics/Add_Immediate";
//Data Transfer Intructions
import { LoadWord } from "../Instructions/Data_Transfer/Load_word";
import { StoreWord } from "../Instructions/Data_Transfer/Store_Word";
import { LoadHalf } from "../Instructions/Data_Transfer/Load_Half_Word";
import { StoreHalf } from "../Instructions/Data_Transfer/Store_Half_Word";
import { LoadByte } from "../Instructions/Data_Transfer/Load_Byte";
import { StoreByte } from "../Instructions/Data_Transfer/Store_Byte";
//Logic Instructions
import { And } from "../Instructions/Logic/And";
import { Or } from "../Instructions/Logic/Or";
import { Nor } from "../Instructions/Logic/Nor";
import { And_immediate } from "../Instructions/Logic/And_immediate";
import { Or_immediate } from "../Instructions/Logic/Or_immediate";
import { Shift_Left_Logical } from "../Instructions/Logic/Shift_Left_Logical";
import { Shift_Right_Logical } from "../Instructions/Logic/Shift_Right_Logical";
//Conditional Deviation Instructions
import { Branch_On_Equal } from "../Instructions/Conditional_Deviation/Branch_On_Equal";
import { Branch_On_Not_Equal } from "../Instructions/Conditional_Deviation/Branch_On_Not_Equal";
import { Set_On_Less_Than } from "../Instructions/Conditional_Deviation/Set_On_Less_Than";
import { Set_On_Less_Than_Unsigned } from "../Instructions/Conditional_Deviation/Set_On_Less_Than_Unsigend";
import { Set_On_Less_Than_Immediate } from "../Instructions/Conditional_Deviation/Set_On_Less_Than_Immediate";
import { Set_On_Less_Than_Immediate_Unsigned } from "../Instructions/Conditional_Deviation/Set_On_Less_Than_Immediate_Unsigned";
//Unconditional Deviation Instructions
import { Jump } from "../Instructions/Unconditional_Deviation/Jump";
import { Jump_Register } from "../Instructions/Unconditional_Deviation/Jump_Register";
import { Jump_And_Link } from "../Instructions/Unconditional_Deviation/Jump_And_Link";
//Control Add-ons
import { Literal_Control } from "../Instructions/Literal_Control";

export class InstructionSet {
  private instructions: IInstruction[] = [
    //Arithematics
    new Add(),
    new Subtract(),
    new Add_Immediate(),
    //Data Transfer
    new LoadWord(),
    new StoreWord(),
    new LoadHalf(),
    new StoreHalf(),
    new LoadByte(),
    new StoreByte(),
    //Logical
    new And(),
    new Or(),
    new Nor(),
    new And_immediate(),
    new Or_immediate(),
    new Shift_Left_Logical(),
    new Shift_Right_Logical(),
    //Conditional Deviation
    new Branch_On_Equal(),
    new Branch_On_Not_Equal(),
    new Set_On_Less_Than(),
    new Set_On_Less_Than_Unsigned(),
    new Set_On_Less_Than_Immediate(),
    new Set_On_Less_Than_Immediate_Unsigned(),
    //Unconditional Deviation
    new Jump(),
    new Jump_Register(),
    new Jump_And_Link(),
    //Miscellaneous
    new Literal_Control(),
  ];
  
  findMatchingInstruction(line: string): IInstruction | null {
    return this.instructions.find(instr => instr.match(line)) || null;
  }
  
  findLabel(line: string): IInstruction | null{
    const labelPattern = /^\s*([A-Z0-9_]+):\s*(.*)?$/i
    if (labelPattern.test(line)) {
      return this.instructions.find(instr => instr instanceof Literal_Control ? instr.match(line) : null) || null;
    }
    return null;
  }
}
