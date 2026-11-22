<p align="center">
  <img src="https://img.shields.io/badge/Voice-Group%20Rooms-blueviolet?style=for-the-badge&logo=discord&logoColor=white" alt="Voice Group Rooms"/>
</p>

<h1 align="center">🎙️ RoomsCalling</h1>

<p align="center">
  <b>Sistema de salas de voz em grupo estilo Discord</b><br>
  Crie uma sala • Compartilhe o ID • Entre com até 5 pessoas
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white"/>
  <img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white"/>
  <img src="https://img.shields.io/badge/Sketchware-FF6B00?style=flat-square&logo=androidstudio&logoColor=white"/>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square"/>
</p>

---

## ✨ Funcionalidades

| Recurso                    | Status |
|---------------------------|--------|
| Criar sala com ID aleatório | ✅ |
| Entrar por ID da sala      | ✅ |
| Áudio PCM 16kHz em tempo real | ✅ |
| Limite de 5 usuários por sala | ✅ |
| Mute / Speaker             | ✅ |
| Reconexão automática       | ✅ |
| Heartbeat                  | ✅ |
| Foreground Service         | ✅ |
| Cancelamento de eco (AEC)  | ✅ |
| Supressor de ruído         | ✅ |

---

## 🛠️ Tecnologias

| Camada     | Tecnologia                    |
|------------|-------------------------------|
| Servidor   | Node.js + `ws`                |
| Cliente    | Java (Sketchware Pro)         |
| Áudio      | AudioRecord + AudioTrack      |
| Protocolo  | WebSocket (texto + binário)   |
| Efeitos    | AcousticEchoCanceler + NoiseSuppressor |

---

## 🚀 Servidor

```bash
npm install ws
node server.js
```

| Configuração | Valor     |
|--------------|-----------|
| Porta padrão | `8080`    |
| Variável     | `PORT`    |
| Máx. usuários| `5`       |

---

## 📱 Cliente (Sketchware)

1. Adicione a biblioteca **Java-WebSocket**
2. Cole as classes:
   - `VoiceCallManager.java`
   - `CallForegroundService.java`
3. Declare o Service no `AndroidManifest.xml`

```xml
<service
    android:name=".CallForegroundService"
    android:foregroundServiceType="microphone"
    android:exported="false" />
```

---

## 📡 Protocolo WebSocket

### Registro
```json
{ "type": "register", "uid": "SEU_UID" }
```

### Criar sala
```json
{ "type": "create_room" }
```

### Entrar na sala
```json
{ "type": "join_room", "roomId": "ABC123" }
```

### Sair da sala
```json
{ "type": "leave_room" }
```

### Áudio
Enviado como **mensagem binária** (PCM 16-bit mono 16000Hz)

---

## 🎮 Uso no App

```java
VoiceCallManager manager = new VoiceCallManager(context, "ws://SEU_IP:8080", meuUid, new VoiceCallManager.OnCallListener() {
    @Override public void onConnected() {}
    @Override public void onRoomCreated(String roomId) {}
    @Override public void onRoomJoined(String roomId, List<String> users) {}
    @Override public void onUserJoined(String uid) {}
    @Override public void onUserLeft(String uid) {}
    @Override public void onRoomUsers(List<String> users) {}
    @Override public void onRoomLeft() {}
    @Override public void onError(String error) {}
    @Override public void onHangup() {}
});

// Criar sala
manager.createRoom();

// Entrar em sala
manager.joinRoom("ABC123");

// Sair
manager.leaveRoom();

// Mute
manager.setMuted(true);

// Speaker
manager.setSpeakerphone(true);
```

---

## 📦 Estrutura do Projeto

```
RoomsCalling/
├── server.js                  # Servidor de salas WebSocket
├── package.json
├── package-lock.json
├── node_modules/
├── VoiceCallManager.java      # Lógica de voz + WebSocket
├── CallForegroundService.java # Serviço em primeiro plano
├── LICENSE                    # Licença proprietária
└── README.md
```

---

## ⚠️ Requisitos

- `RECORD_AUDIO`
- `FOREGROUND_SERVICE`
- `FOREGROUND_SERVICE_MICROPHONE` (Android 14+)
- Internet / WebSocket

---

## 📄 Licença

**PROPRIETARY LICENSE — ALL RIGHTS RESERVED**

Copyright (c) 2026 nicolasteles853. All Rights Reserved.

This software, source code, and associated documentation files (the "Software") are the exclusive property of the copyright holder.

Except for viewing the source code as permitted by the GitHub Terms of Service while hosted in a public repository, no license or right is granted to any person or entity to use, copy, modify, or distribute this Software for any purpose.

Without prior express written permission from the copyright holder, you may NOT:
- Use, run, or deploy the Software in any personal, academic, or commercial environment
- Copy, modify, merge, publish, distribute, sublicense, rent, lease, transfer, or sell copies of the Software
- Reverse engineer, decompile, or disassemble the Software
- Remove or alter any copyright or proprietary notices

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Consulte o arquivo [LICENSE](./LICENSE) para o texto completo da licença.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Private-important?style=for-the-badge"/>
</p>
