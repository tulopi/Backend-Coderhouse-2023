const socketClient = io();

const addForm = document.getElementById("addForm");
const delForm = document.getElementById("delForm");

socketClient.on("connected", () => {
    console.log("connected");
});

addForm.onsubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const product = {};
    formData.forEach((value, key) => {
        product[key] = value;
    });
    socketClient.emit("addProduct", product);
};

delForm.onsubmit = (event) => {
    event.preventDefault();
    const productId = document.getElementById('id').value;
    socketClient.emit('delByID', productId);
};