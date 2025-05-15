import { Interpreter } from "./Interpreter"

const program = [
    "sub $t0, $t1, $t2",
  ];
  
  const interpreter = new Interpreter();
  interpreter.run(program);