const socketClient = io();
const userEmail = document.getElementById("email");
const chatForm = document.getElementById("chatform");
const chat = document.getElementById("chat");
const inputMessage = document.getElementById("message");

let user = null;

if (!user) {
    Swal.fire({
        title: "Welcome",
        text: "Please enter your email",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "You need to enter your email";
            }
        },
    }).then((result) => {
        user = result.value;
        userEmail.innerHTML = user;
        socketClient.emit("newUser", user);
    });
}

function scrollToBottom() {
    const chatContainer = document.getElementById("chat-messages");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatForm.onsubmit = (e) => {
    e.preventDefault();
    const info = {
        user: user,
        message: inputMessage.value,
    };
    socketClient.emit("message", info);
    inputMessage.value = " ";
    scrollToBottom();
};

socketClient.on("chatBox", (messages) => {
    const chatRender = messages
        .map((message) => {
            console.log(message)
            const messageDate = new Date(message.createdAt);
            const timeOptions = { hour: "2-digit", minute: "2-digit" };
            const timeFormat = messageDate.toLocaleTimeString(undefined, timeOptions);
            return `<p><strong>${timeFormat}</strong> - <strong>${message.email}</strong>: ${message.message}</p>`;
        })
        .join("");
    chat.innerHTML = chatRender;
});

socketClient.on("broadcast", (user) => {
    Toastify({
        text: `${user} joined the chat`,
        duration: 5000,
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
});

document.getElementById("clearChat").addEventListener("click", () => {
    document.getElementById("chat").textContent = "";
    socketClient.emit("clear");
});