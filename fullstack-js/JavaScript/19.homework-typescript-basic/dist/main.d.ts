declare function sumArray(numbers: number[]): number;
type User = {
    name: string;
    age: number;
    isActive: boolean;
};
declare function createUser(name: string, age: number, isActive?: boolean): User;
declare const newUser: User;
declare enum OrderStatus {
    Pending = 0,
    Shipped = 1,
    Delivered = 2,
    Cancelled = 3
}
declare function getOrderStatus(status: OrderStatus): string;
//# sourceMappingURL=main.d.ts.map