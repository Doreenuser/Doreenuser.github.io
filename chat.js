const apiKey = "3aebd5a479684c7e92d6167f6dd26191";
const reqId = "4ffcac1c-b2fc-48ba-bd6d-b69d9942995a";
const projectName = "Doreen";
const deploymentName = "intent";

const apiUrl = "https://luis-doreen.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview";
const chatLog = document.getElementById("chatLog");
const userInput = document.getElementById("userInput");

function displayMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.className = sender === "user" ? "user-message" : "bot-message";
  messageElement.textContent = message;
  chatLog.appendChild(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function getBotResponse(userMessage) {
  const payload = {
    kind: "Conversation",
    analysisInput: {
      conversationItem: {
        id: "1",
        text: userMessage,
        modality: "text",
        participantId: "user1",
      },
    },
    parameters: {
      projectName: projectName,
      verbose: true,
      deploymentName: deploymentName,
      stringIndexType: "TextElement_V8",
    },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Apim-Request-Id": reqId,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  const topIntent = data.result.prediction.topIntent;
  displayMessage(topIntent);

  switch (topIntent) {
    case "個人簡介":
      displayMessage("bot", "這裡是我的個人簡介...");
      break;
    case "再見":
      displayMessage("bot", "再見，祝你有美好的一天！");
      break;
    case "打招呼":
      displayMessage("bot", "嗨，你好！");
      break;
    case "專案作品":
      displayMessage("bot", "這是我最近的專案作品...");
      break;
    case "社交媒體連結":
      displayMessage("bot", "你可以在這些社交媒體上找到我...");
      break;
    case "聯絡方式":
      displayMessage("bot", "如果需要聯絡我，可以寫信到contact@example.com。");
      break;
    default:
      displayMessage("bot", "抱歉，我不太理解你的問題。");
      break;
  }
}

function sendMessage() {
  const message = userInput.value;
  if (message.trim() === "") return;
  displayMessage("user", message);
  getBotResponse(message);
  userInput.value = "";
}

userInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
