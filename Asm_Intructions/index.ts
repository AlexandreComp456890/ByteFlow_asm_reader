import { Interpreter } from "./Runtime/Interpreter";

const program =[
    "MAIN:",
        "addi $s0, $zero, 0x10008000", 
        "addi $t1, $zero, 0x10008000",
        "addi $s1, $zero, 10",
        "sltiu $t0, $s0, 10000", 
        "bne $t1, $s0, Bain",
        "add $t2, $t1, $s0",
        "jal End",
    "Bain:",
        "ori $t3, $t1, 20000",
        "sw $t1, 8($s0)",
        "lh $t2, 8($s0)",
    "End:"
];

const interpreter = new Interpreter();
interpreter.run(program);


