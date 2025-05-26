export class ExecutionContext {
    //regiters atributes
    registers: Record<string, number> = {};
    currentLine: string = "";

    //memory atributes
    static memory: Record<number, number> = {};
    private MEMORY_START: number = 0x10008000;
    private MEMORY_END: number = 0x1001FFFF;
    

    constructor() {
        for (let r of [
            "zero",
            "v0", "v1",
            "a0", "a1", "a2", "a3",
            "t0","t1","t2","t3","t4","t5","t6","t7",
            "s0","s1","s2","s3","s4","s5","s6","s7",
            "t8","t9",
            "gp",
            "sp",
            "fp",
            "ra"
        ]) {
            this.registers[r] = 0;
        }

        for (let i= this.MEMORY_START; i <= this.MEMORY_END; i+=4){
            ExecutionContext.memory[i] = 0x00;
        }
    }

    getRegister(name: string): number {
        return this.registers[name] ?? 0x00;
    }

    setRegister(name: string, value: number | null): void {
        if (name === "zero") return; // $zero is always 0
        if (value !== null) this.registers[name] = value;
    }

    //Get the value from memory
    getMemory(address:number): number | null{
        //Control over which store instruction is beeing used
        const halfPattern = /^\s*lh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
        const bytePattern = /^\s*lb\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;

        let half: boolean =  halfPattern.test(this.currentLine);
        let byte: boolean =  bytePattern.test(this.currentLine);

        if (!this.memoryCheck(address, half, byte)) return null;
        return ExecutionContext.memory[address] ?? 0;
    }

    setMemory(address: number, value: number): void {
        //Control over which store instruction is beeing used
        const halfPattern = /^\s*sh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
        const bytePattern = /^\s*sb\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;

        let half: boolean =  halfPattern.test(this.currentLine);
        let byte: boolean =  bytePattern.test(this.currentLine);

        if (!this.memoryCheck(address, half, byte)) return;
        ExecutionContext.memory[address] = value;
    }

    private memoryCheck(address: number, half: boolean, byte: boolean): boolean {
        if (address < this.MEMORY_START && address > this.MEMORY_END-4){
            console.error(`Memory address ${ExecutionContext.fixToHex(address)} is out of bounds. Faulty line: ${this.currentLine}`);
            return false;
        }
        if (half) {
            if (address % 2 !== 0){
                console.log(`Address ${ExecutionContext.fixToHex(address)} is not a valid start address on half word boundary.Faulty line: ${this.currentLine}`);
                return false;
            }
            return true;
        }
        if (!half && !byte && address % 4 !== 0){
            console.log(`Address ${ExecutionContext.fixToHex(address)} is not a valid start address on word boundary.Faulty line: ${this.currentLine}`);
            return false;
        }
        return true;
    }

    static fixToHex(value: number): string {
        return "0x" + value.toString(16).padStart(8, '0').toUpperCase();
    }
}
