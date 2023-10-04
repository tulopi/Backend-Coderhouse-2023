const socketClient = io();

document.getElementById("addForm").addEventListener("submit", (add) => {
    add.preventDefault();
    const formData = new formData(add.target);
    const product = {};
    formData.forEach((value, key) => {
        product[key] = value;
    });
    console.log(product);
    socketClient.emit("addProduct", product);
});

document.getElementById('delForm').addEventListener('submit', (del) => {
    del.preventDefault();
    const productId = document.getElementById('id').value;
    socket.emit('delByID', productId);
});