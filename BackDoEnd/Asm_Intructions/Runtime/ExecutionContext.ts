export class ExecutionContext {
    registers: Record<string, number> = {};
    memory: number[] = [];
    currentLine: string = "";

    constructor() {
        for (let r of [
            "zero",
            "t0",
            "t1",
            "t2",
            "t3",
            "t4",
            "t5",
            "t6",
            "t7",
        ]) {
            this.registers[r] = 0;
        }
    }

    getRegister(name: string): number {
        return this.registers[name] ?? 0;
    }

    setRegister(name: string, value: number): void {
        if (name === "zero") return; // $zero is always 0
        this.registers[name] = value;
    }
}
