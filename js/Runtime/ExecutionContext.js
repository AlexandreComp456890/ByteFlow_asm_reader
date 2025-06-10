export class ExecutionContext {
    constructor() {
        //regiters atributes
        this.registers = {};
        this.MEMORY_START = 0x10008000;
        this.MEMORY_END = 0x1001FFFF;
        //Program couter control
        this.currentLine = "";
        this.allLines = {};
        this.literals = {};
        for (let r of [
            "zero",
            "at",
            "v0", "v1",
            "a0", "a1", "a2", "a3",
            "t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7",
            "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7",
            "t8", "t9",
            "gp",
            "sp",
            "fp",
            "ra"
        ]) {
            this.registers[r] = 0;
        }
        for (let i = this.MEMORY_START; i <= this.MEMORY_END; i += 4) {
            ExecutionContext.memory[i] = 0x00;
        }
    }
    getRegister(name) {
        var _a;
        return (_a = this.registers[name]) !== null && _a !== void 0 ? _a : 0x00;
    }
    setRegister(name, value) {
        if (name === "zero")
            return; // $zero is always 0
        if (value !== null)
            this.registers[name] = value;
    }
    //Get the value from memory
    getMemory(address) {
        var _a;
        //Control over which store instruction is beeing used
        const halfPattern = /^\s*lh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
        const bytePattern = /^\s*lb\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
        let half = halfPattern.test(this.currentLine);
        let byte = bytePattern.test(this.currentLine);
        if (!this.memoryCheck(address, half, byte))
            return null;
        return (_a = ExecutionContext.memory[address]) !== null && _a !== void 0 ? _a : 0;
    }
    setMemory(address, value) {
        //Control over which store instruction is beeing used
        const halfPattern = /^\s*sh\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
        const bytePattern = /^\s*sb\s+\$(\w+),\s*([-+]?\w+)\s*\(\s*\$(\w+)\s*\)\s*$/i;
        let half = halfPattern.test(this.currentLine);
        let byte = bytePattern.test(this.currentLine);
        if (!this.memoryCheck(address, half, byte))
            return;
        ExecutionContext.memory[address] = value;
    }
    memoryCheck(address, half, byte) {
        if (address < this.MEMORY_START && address > this.MEMORY_END - 4) {
            console.error(`Memory address ${ExecutionContext.fixToHex(address)} is out of bounds. Faulty line: ${this.currentLine}`);
            return false;
        }
        if (!half && !byte && address % 4 !== 0) {
            console.log(`Address ${ExecutionContext.fixToHex(address)} is not a valid start address on word boundary. Faulty line: ${this.currentLine}`);
            return false;
        }
        if (half && address % 2 !== 0) {
            console.log(`Address ${ExecutionContext.fixToHex(address)} is not a valid start address on half word boundary. Faulty line: ${this.currentLine}`);
            return false;
        }
        return true;
    }
    static fixToHex(value) {
        return "0x" + value.toString(16).padStart(8, '0').toUpperCase();
    }
}
//memory atributes
ExecutionContext.memory = {};
ExecutionContext.programCounter = 0x00400000;
