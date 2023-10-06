const socketClient = io();


const addForm = document.getElementById("addForm");
const delForm = document.getElementById("delForm");


socketClient.on("connect", () => {
    console.log("User connected");
});

addForm.onsubmit = (event) => {
    event.preventDefault();
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const thumbnail = document.getElementById("thumbnail");
    const code = document.getElementById("code");
    const price = document.getElementById("price");
    const stock = document.getElementById("stock");

    const product = {
        title: title.value,
        description: description.value,
        price: price.value,
        thumbnail: thumbnail.value,
        code: code.value,
        stock: stock.value,
    }
    console.log(product);
    socketClient.emit("addProduct", product);
};

delForm.onsubmit = (event) => {
    let productIdInput = document.getElementById("productId");
    let productId = parseInt(productIdInput.value);
    console.log(productId);
    event.preventDefault();
    socketClient.emit('delById', productId);
};

socketClient.on("productUpdate", () => {
    location.reload();
});