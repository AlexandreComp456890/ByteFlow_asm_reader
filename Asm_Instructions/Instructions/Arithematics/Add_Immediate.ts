import { IInstruction } from "../IInstructions";
import { ExecutionContext } from "../../Runtime/ExecutionContext";

export class Add_Immediate implements IInstruction {
    private regex = /^\s*(?:(\w+):)?\s*addi\s+\$(\w+),\s*\$(\w+),\s*(\w+)\s*(?:#\s*(.*))?$/i;

    match(line: string): boolean {
        return this.regex.test(line);
    }

    execute(context: ExecutionContext): void {
        const match = this.regex.exec(context.currentLine);
        if (!match) return;

        const [, , dest, src1, src2] = match;
        const val1 = context.getRegister(src1);
        const val2 = Number(src2);
        context.setRegister(dest, val1 + val2);

        context.encodedInst = this.encondingForTheHolyMachine({registers: context.registers, rs: src1, rt: dest, immediate: val2});
    }
        
    encondingForTheHolyMachine(params: {registers: Record<string,number>, rt: string, rs: string, immediate: number}): number | number[]{
        // type I
        const opcode = "001000";
        const registerValue = Object.keys(params.registers);

        const rs = (registerValue.indexOf(params.rs)).toString(2).padStart(5, '0');
        const rt = (registerValue.indexOf(params.rt)).toString(2).padStart(5, '0');
        
        if (params.immediate > 0xFFFF){
            const at = (registerValue.indexOf("at")).toString(2).padStart(5, '0');
            const upperHalp = (params.immediate >> 16).toString(2).padStart(16, '0');
            const lowerHalp = () => {
                let aux: string = ExecutionContext.fixToHex(params.immediate);
                aux = aux.slice((aux.length -4), (aux.length));
                
                let value = parseInt(aux.toString().replace(/[!.,]/g, ''), 16);
                return value.toString(2).padStart(16, '0');
            };

            const lui = parseInt(("001111"+ "00000" + at + upperHalp), 2);
            params.registers.at = parseInt(upperHalp, 2) << 16;
            const ori = parseInt(("001101" + at + at + lowerHalp()), 2);
            params.registers.at = (params.registers.at | parseInt(lowerHalp(),2));
            const add = parseInt(("000000" + rs + at + rt + "00000" + "100000"), 2)

            return [
                lui,
                ori,
                add
            ];
        }
        
        const immediate = params.immediate.toString(2).padStart(16, '0');
        return parseInt((opcode + rs + rt + immediate),2);
    }

    instructionType(): string {
        return "I";
    }
}