export class ExecutionContext {
    //regiters atributes
    registers: Record<string, number> = {};
    currentLine: string = "";

    //memory atributes
    memory: Record<number, number> = {};
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
            this.memory[i] = 0x00;
        }
    }

    getRegister(name: string): number {
        return this.registers[name] ?? 0x00;
    }

    setRegister(name: string, value: number): void {
        if (name === "zero") return; // $zero is always 0
        this.registers[name] = value;
    }

    private memoryCheck(address: number): boolean {
        return (address >= this.MEMORY_START && address <= this.MEMORY_END-4) && (address % 4 === 0);
    }

    //Get the value from memory
    getMemory(address:number): number {
        if (!this.memoryCheck(address)){
            throw new Error(`Memory address ${address.toString(16)} is out of bounds.`);
        }
        return this.memory[address] ?? 0;
    }

    setMemory(name: string, address: number, value: number): void {
        if (!this.memoryCheck(address)){
            throw new Error(`Memory address ${address.toString(16)} is out of bounds.`);
        }
        this.memory[address] = value;
        this.registers[name] = 0x00;                                                                    //When a register value is stored in the memory, it is set back to 0x00
    }
}
