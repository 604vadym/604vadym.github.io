import { useState, useTransition, useMemo } from "react";
import ProductItem from "./ProductItem";

interface Product {
    id: number;
    name: string;
}

function generateProducts(count: number): Product[] {
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
        products.push({
            id: i,
            name: "Product " + (i + 1),
        });
    }
    return products;
}

function filterProducts(query: string, allProducts: Product[]): Product[] {
    if (!query) return [];
    return allProducts.filter((product) => product.name.includes(query));
}

function OptimizedSearch() {
    const [query, setQuery] = useState<string>("");
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [isPending, startTransition] = useTransition();
    const products = useMemo(() => generateProducts(10000), []);

    const handleSearch = (value: string) => {
        setQuery(value);
        startTransition(() => {
            setFilteredResults(filterProducts(value, products));
        });
    };

    return (
        <>
            <input
                type="number"
                value={query}
                placeholder="Enter number to filter pdoducts"
                style={{ width: "200px" }}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {isPending && <p>Filtering...</p>}
            <div style={{ opacity: isPending ? "0.5" : "1" }}>
                {filteredResults.map((item) => (
                    <ProductItem key={item.id} name={item.name}></ProductItem>
                ))}
            </div>
        </>
    );
}

export default OptimizedSearch;
