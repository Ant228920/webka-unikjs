type Size = "small" | "large";
type Topping = "chocolate" | "caramel" | "berries";

function calculateIceCreamPrice(size: Size, toppings: Topping[], marshmallow: boolean = false): number {
    const sizePrices: Record<Size, number> = {
        small: 10,
        large: 25
    };

    const toppingPrices: Record<Topping, number> = {
        chocolate: 5,
        caramel: 6,
        berries: 10
    };

    let total = sizePrices[size];

    for (const topping of toppings) {
        total += toppingPrices[topping];
    }

    if (marshmallow) {
        total += 5;
    }

    return total;
}
const sizeInput = prompt("Введіть розмір морозива: small або large") as Size;

const toppingsInput = prompt(
    "Введіть начинки через кому (chocolate, caramel, berries)"
);

const marshmallowInput = prompt("Додати маршмелоу? (yes/no)");

if (sizeInput && toppingsInput) {
    const toppings = toppingsInput
        .split(",")
        .map(t => t.trim() as Topping)
        .filter(Boolean);

    const marshmallow = marshmallowInput?.toLowerCase() === "yes";

    const price = calculateIceCreamPrice(sizeInput, toppings, marshmallow);

    const numberElement = document.getElementById("number");
    if (numberElement) {
        numberElement.innerHTML = `Вартість вашого морозива: ${price} грн`;
    }
}