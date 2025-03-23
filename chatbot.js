// Cargar automáticamente "nube.geojson" (asegúrate que se llame exactamente "nube.geojson")
let geoData = null;
let geoDataPromise = fetch("nube.geojson")
  .then(response => response.json())
  .then(data => { 
    geoData = data; 
    console.log("GeoJSON cargado:", geoData);
  })
  .catch(err => console.error("Error al cargar nube.geojson:", err));

// Nueva variable global para el token
let hfToken = null;

// Función para cargar el token desde config.json
async function loadConfig() {
  try {
    const res = await fetch("config.json");
    const config = await res.json();
    hfToken = config.HF_TOKEN;
  } catch (err) {
    console.error("Error cargando config.json:", err);
  }
}

// Asegúrate de cargar la configuración antes de llamar al modelo
await loadConfig();

/**
 * Construye el prompt integrando la información del GeoJSON y la consulta del usuario.
 * Espera a que se hayan cargado los datos.
 */
async function getLLMResponse(userPrompt) {
  if (!geoData) {
    await geoDataPromise;
  }
  if (!geoData || !geoData.features) {
    return "No tengo información disponible sobre empresas.";
  }
  
  let resumen = geoData.features.map((f, i) => {
    const props = f.properties;
    return `(${i + 1}) ${props.nom_estab} - ${props.entidad} - Prioridad: ${props.prioridad_venta} - Canal: ${props.canal_preferido}`;
  }).join("\n");
  
  const fullPrompt = `
Eres un asistente experto en ventas agrícolas. Tienes la siguiente información de empresas extraída de un GeoJSON:
${resumen}

Responde de manera clara, concisa y amigable en español a la siguiente consulta del usuario: "${userPrompt}"
  `;
  
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + hfToken,  // se usa el token cargado
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });
    
    const result = await response.json();
    if (Array.isArray(result) && result[0]?.generated_text) {
      return result[0].generated_text;
    } else if (result.error) {
      return `Error: ${result.error}`;
    } else {
      return "No se obtuvo respuesta del modelo.";
    }
  } catch (error) {
    console.error("Error al llamar al modelo:", error);
    return "Error al conectar con el modelo.";
  }
}

// Nueva función para formatear el texto con saltos de línea y emojis
function formatResponseText(text) {
  // Convertir saltos de línea a <br>
  let formatted = text.replace(/\n/g, "<br>");
  // Ejemplo simple: sustituir ":)" por emoji
  formatted = formatted.replace(/:\)/g, "😊");
  // Puedes ampliar reemplazos según necesites
  return formatted;
}

/**
 * Agrega un mensaje al registro del chat con estilo de burbuja.
 */
function addChatMessage(sender, text) {
  const chatLog = document.getElementById("chatLog");
  if (!chatLog) return;
  
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.classList.add(sender === "Tú" ? "user" : "assistant");
  
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  // Si es mensaje del Chatbot, formatea el texto
  bubble.innerHTML = sender === "Chatbot" ? formatResponseText(text) : text;
  
  msgDiv.appendChild(bubble);
  chatLog.appendChild(msgDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

/**
 * Maneja el envío del mensaje del usuario.
 */
async function handleChat() {
  const inputEl = document.getElementById("chatInput");
  const userText = inputEl.value.trim();
  if (!userText) return;
  addChatMessage("Tú", userText);
  inputEl.value = "";
  
  // Muestra un spinner usando un emoji de reloj de arena
  const loadingId = "loading-" + Date.now();
  addChatMessage("Chatbot", `<span id="${loadingId}">⌛</span>`);
  
  const reply = await getLLMResponse(userText);
  
  // Eliminar el spinner y reemplazarlo por la respuesta formateada
  const chatLog = document.getElementById("chatLog");
  const lastMsg = chatLog.lastChild;
  if (lastMsg) {
    lastMsg.querySelector(".bubble").innerHTML = formatResponseText(reply);
  }
}

/**
 * Permite enviar un prompt predefinido.
 */
function sendPrompt(promptText) {
  document.getElementById("chatInput").value = promptText;
  handleChat();
}

// Permitir enviar mensaje con Enter
document.getElementById("chatInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    handleChat();
  }
});