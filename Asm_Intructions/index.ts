import { Interpreter } from "./Interpreter";

const program =["addi $s0, $zero, 268468224", "addi $t1, $t1, 25", "sw $t1, 0($s0)", "lw $t2, 0($s0)"];

const interpreter = new Interpreter();
interpreter.run(program);
