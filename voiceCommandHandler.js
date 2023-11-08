const axios = require("axios");
const child_process = require("child_process");
const { TELEGRAM_API_KEY } = require("./config");
const { YA_API_KEY } = require("./config");

function handleVoiceCommand(bot, msg) {
  const stream = bot.getFileStream(msg.voice.file_id);
  let chunks = [];

  stream.on("data", (chunk) => chunks.push(chunk));

  stream.on("end", () => {
    const axiosConfig = {
      method: "POST",
      url: "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize",
      headers: {
        Authorization: "Api-Key " + YA_API_KEY,
      },
      data: Buffer.concat(chunks),
    };

    axios(axiosConfig)
      .then((response) => {
        const recognizedText = response.data.result;
        console.log("Распознанный текст:", recognizedText);

        if (recognizedText.includes("Выключи компьютер")) {
          // Команда для выключения Windows
          child_process.exec("shutdown /s /t 0", (error, stdout, stderr) => {
            if (error) {
              console.error("Ошибка при выключении Windows:", error);
            } else {
              console.log("Windows выключается...");
              bot.sendMessage(msg.chat.id, "Windows выключается...");
            }
          });
        } else if (recognizedText.includes("Перезагрузи компьютер")) {
          // Команда для перезагрузки Windows
          child_process.exec("shutdown /r /t 0", (error, stdout, stderr) => {
            if (error) {
              console.error("Ошибка при перезагрузке Windows:", error);
            } else {
              console.log("Windows перезагружается...");
              bot.sendMessage(msg.chat.id, "Windows перезагружается...");
            }
          });
        }
      })
      .catch((error) => {
        console.error("Ошибка при отправке запроса:", error);
      });
  });
}

module.exports = handleVoiceCommand;
