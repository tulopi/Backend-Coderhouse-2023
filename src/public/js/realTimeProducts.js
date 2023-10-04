const socketClient = io();

const addForm = document.getElementById("addForm");
const delForm = document.getElementById("delForm");

addForm.addEventListener("submit", (event) => {
    add.preventDefault();
    const formData = new FormData(event.target);
    const product = {};
    formData.forEach((value, key) => {
        product[key] = value;
    });
    socketClient.emit("addProduct", product);
});

delForm.addEventListener('submit', (event) => {
    del.preventDefault();
    const productId = document.getElementById('id').value;
    socketClient.emit('delByID', productId);
});