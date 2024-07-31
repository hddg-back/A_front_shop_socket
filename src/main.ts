import { connectServer } from "./socket-io";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <section id="section-auth-token">
      <h1>Ingrese jwt de autenticación</h1>
        <input 
          type="text" 
          id="token-input" 
          placeholder="Json Web Token"
        >
        <input type="submit" id="btn-connect" value="Conectar"/>
    </section>
    <p>Estado: <span id="status-label">OffLine</span></p>
    <section id="section-messages" style="display: none">
      <h1>Personas conectadas (wsId)</h1>
      <ul id="clientes-ul"></ul>
      <form id="message-form">
        <input 
        type="text" 
        id="message-input" 
        placeholder="Escribir un mensaje"
        />
        <input type="submit" value="Enviar" />
        <input type="button" value="Desconectar" id="btn-desconectar" />
      </form>
      <h2>MENSAJES</h2>
      <ul id="clientes-messages">
      </ul>
    </section
  </div>
`;

const inputToken = document.querySelector<HTMLInputElement>("#token-input")!;
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect")!;

btnConnect.addEventListener("click", () => {
  if (inputToken.value.trim().length <= 0) return alert("Ingrese un JWT");
  connectServer(inputToken.value.trim());
  inputToken.value = "";
});
