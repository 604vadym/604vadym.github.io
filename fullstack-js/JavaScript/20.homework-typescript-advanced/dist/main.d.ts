interface PersonInterface {
    name: string;
    age: number;
    isActive: boolean;
}
declare function createPerson(name: string, age: number, isActive: boolean): PersonInterface;
declare const newPerson: PersonInterface;
declare function LogMethodCalls(target: any, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor;
declare class Calculator {
    add(num1: number, num2: number): number;
    multiply(num1: number, num2: number): number;
}
declare const calculator: Calculator;
declare namespace UserProfile {
    interface ProfileInterface {
        id: string;
        name: string;
        email: string;
    }
    function createProfile(name: string, email: string): ProfileInterface;
}
declare const profile: UserProfile.ProfileInterface;
//# sourceMappingURL=main.d.ts.map