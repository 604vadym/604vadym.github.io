interface ProductItemProps {
    name: string;
}

function ProductItem({ name }: ProductItemProps) {
    let i = 88888;
    let j = 0;
    while (i--) {
        j += Math.sqrt(i);
    }
    return (
        <span
            data-calc={j}
            style={{ marginRight: "6px", display: "inline-block" }}
        >
            {name}
        </span>
    );
}

export default ProductItem;
