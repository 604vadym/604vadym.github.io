export function getTotalPrice(orders) {
    return orders.reduce((accum, order) => accum + order.price, 0);
}
