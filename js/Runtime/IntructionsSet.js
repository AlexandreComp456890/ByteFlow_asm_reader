//Arithematic Instructions
import { Add } from "../Instructions/Arithematics/Add.js";
import { Subtract } from "../Instructions/Arithematics/Subtract.js";
import { Add_Immediate } from "../Instructions/Arithematics/Add_Immediate.js";
import { Mult } from "../Instructions/Arithematics/Multiplicate.js";
//Data Transfer Intructions
import { LoadWord } from "../Instructions/Data_Transfer/Load_word.js";
import { StoreWord } from "../Instructions/Data_Transfer/Store_Word.js";
import { LoadHalf } from "../Instructions/Data_Transfer/Load_Half_Word.js";
import { StoreHalf } from "../Instructions/Data_Transfer/Store_Half_Word.js";
import { LoadByte } from "../Instructions/Data_Transfer/Load_Byte.js";
import { StoreByte } from "../Instructions/Data_Transfer/Store_Byte.js";
import { LoadImmediate } from "../Instructions/Data_Transfer/Load_immediate.js";
//Logic Instructions
import { And } from "../Instructions/Logic/And.js";
import { Or } from "../Instructions/Logic/Or.js";
import { Nor } from "../Instructions/Logic/Nor.js";
import { And_immediate } from "../Instructions/Logic/And_immediate.js";
import { Or_immediate } from "../Instructions/Logic/Or_immediate.js";
import { Shift_Left_Logical } from "../Instructions/Logic/Shift_Left_Logical.js";
import { Shift_Right_Logical } from "../Instructions/Logic/Shift_Right_Logical.js";
import { NOP } from "../Instructions/Logic/nop.js";
//Conditional Deviation Instructions
import { Branch_On_Equal } from "../Instructions/Conditional_Deviation/Branch_On_Equal.js";
import { Branch_On_Not_Equal } from "../Instructions/Conditional_Deviation/Branch_On_Not_Equal.js";
import { Set_On_Less_Than } from "../Instructions/Conditional_Deviation/Set_On_Less_Than.js";
import { Set_On_Less_Than_Unsigned } from "../Instructions/Conditional_Deviation/Set_On_Less_Than_Unsigend.js";
import { Set_On_Less_Than_Immediate } from "../Instructions/Conditional_Deviation/Set_On_Less_Than_Immediate.js";
import { Set_On_Less_Than_Immediate_Unsigned } from "../Instructions/Conditional_Deviation/Set_On_Less_Than_Immediate_Unsigned.js";
//Unconditional Deviation Instructions
import { Jump } from "../Instructions/Unconditional_Deviation/Jump.js";
import { Jump_Register } from "../Instructions/Unconditional_Deviation/Jump_Register.js";
import { Jump_And_Link } from "../Instructions/Unconditional_Deviation/Jump_And_Link.js";
//Control Add-ons
import { Literal_Control } from "../Instructions/Literal_Control.js";
export class InstructionSet {
    constructor() {
        this.instructions = [
            //Arithematics
            new Add(),
            new Subtract(),
            new Add_Immediate(),
            new Mult(),
            //Data Transfer
            new LoadWord(),
            new StoreWord(),
            new LoadHalf(),
            new StoreHalf(),
            new LoadByte(),
            new StoreByte(),
            new LoadImmediate(),
            //Logical
            new And(),
            new Or(),
            new Nor(),
            new And_immediate(),
            new Or_immediate(),
            new Shift_Left_Logical(),
            new Shift_Right_Logical(),
            new NOP(),
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
    }
    findMatchingInstruction(line) {
        return this.instructions.find(instr => instr.match(line)) || null;
    }
    findLabel(line) {
        const labelPattern = /^\s*([A-Z0-9_]+):\s*(.*)?$/i;
        if (labelPattern.test(line)) {
            return this.instructions.find(instr => instr instanceof Literal_Control ? instr.match(line) : null) || null;
        }
        return null;
    }
}
