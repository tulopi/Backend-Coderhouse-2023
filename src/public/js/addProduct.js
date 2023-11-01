const socketClient = io();

document.addEventListener("DOMContentLoaded", () => {
    const quantity = document.getElementById("quantity");
    const addToCart = document.getElementById("addToCart");

    addToCart.addEventListener("click", () => {
        const quantityValue = parseInt(quantity.value);
        if (quantityValue >= 1) {
            const pid = document.getElementById("product_id").textContent;
            socketClient.emit("addToCart", { pid, quantity : quantityValue });
        } else {
            Swal.fire({
                icon: "error",
                title: "Invalid Quantity",
                text: "Please enter a valid quantity (1 or more)."
            });
        }
    });

    socketClient.on("productAdded", (data) => {
        Swal.fire({
            icon: "success",
            title: "Product Added",
            text: data.message
        });
    });

    socketClient.on("addToCartError", (data) => {
        Swal.fire({
            icon: "error",
            title: "Add to Cart Error",
            text: data.message
        });
    });
});