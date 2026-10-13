interface PersonInterface {
    name: string;
    age: number;
    isActive: boolean;
}
declare function createPerson(name: string, age: number, isActive: boolean): PersonInterface;
declare class Calculator {
    add(num1: number, num2: number): number;
    multiply(num1: number, num2: number): number;
}
export { createPerson, Calculator };
//# sourceMappingURL=main.d.ts.map