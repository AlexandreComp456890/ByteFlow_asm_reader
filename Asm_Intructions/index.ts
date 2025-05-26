import { Interpreter } from "./Runtime/Interpreter";

const program =[
    "addi $s0, $zero, 268468224", "addi $t1, $zero, 268468244", "sw $t1, 0($s0)", "sh $t1, 6($s0)", "sb $t1, 9($s0)", 
    "lw $t3, 0($s0)", "lh $t2, 6($s0)", "lw $t4, 4($s0)", "lw $t6, 8($s0)", "lb $t5, 0($s0)",  
];

const interpreter = new Interpreter();
interpreter.run(program);
