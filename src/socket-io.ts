import { Manager, Socket } from "socket.io-client";

let socket: Socket;
export const connectServer = (token: string) => {
  const manager = new Manager("http://localhost:3001/socket.io/socket.io.js", {
    extraHeaders: {
      authentication: token,
    },
  });
  socket?.removeAllListeners();
  socket = manager.socket("/");
  addListeners();
};

const addListeners = () => {
  const sectionMessages: HTMLDivElement | null =
    document.querySelector("#section-messages")!;
  const sectionAuthToken: HTMLDivElement | null = document.querySelector(
    "#section-auth-token"
  )!;
  const serverStatusLabel: Element | null =
    document.querySelector("#status-label")!;
  const ulClientes: HTMLUListElement | null =
    document.querySelector("#clientes-ul")!;
  const messageForm: HTMLFormElement = document.querySelector("#message-form")!;
  const messageInput: HTMLInputElement =
    document.querySelector("#message-input")!;
  const ulMessagesClientes: HTMLUListElement | null =
    document.querySelector("#clientes-messages")!;
  const btnDisconnect =
    document.querySelector<HTMLButtonElement>("#btn-desconectar")!;

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "Conectado";
    // cambiar estilos body
    document.body.style.background = "green";
    sectionAuthToken.style.display = "none";
    sectionMessages.style.display = "block";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "Desconectado";
    // cambiar estilos body
    document.body.style.background = "gray";
    sectionAuthToken.style.display = "block";
    sectionMessages.style.display = "none";
  });

  socket.on("clients-update", (clients: string[]) => {
    let clientesHtml: string = "";
    clients.forEach((clienteId) => {
      clientesHtml += `<li>${clienteId}</li>`;
    });
    ulClientes.innerHTML = clientesHtml;
  });

  socket.on(
    "messages-from-server",
    (payload: { fullName: string; message: string }) => {
      ulMessagesClientes.innerHTML += `<li><span>${payload.fullName}: </span> ${payload.message}</li>`;
    }
  );

  // event handlers
  messageForm.addEventListener("submit", (e) =>
    handleConnected(e, messageInput)
  );
  /**desconectarse */
  btnDisconnect.addEventListener("click", () => {
    socket.disconnect();
  });
};

const handleConnected = (e: SubmitEvent, messageInput: HTMLInputElement) => {
  e.preventDefault();
  if (messageInput.value.trim().length <= 0) return;

  socket.emit("message-from-client", {
    message: messageInput.value,
  });
  messageInput.value = "";
};
