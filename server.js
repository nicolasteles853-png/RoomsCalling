// ========== SERVIDOR NODE.JS (substitua o arquivo inteiro) ==========
const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;
const MAX_USERS_PER_ROOM = 5;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Voice Group Call Server OK');
});

const wss = new WebSocket.Server({ server, perMessageDeflate: false });

const users = new Map();
const rooms = new Map();

function enviar(ws, obj) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

function gerarRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRoomUsers(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.users);
}

function broadcastRoom(roomId, obj, excludeUid) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.users.forEach(uid => {
    if (uid !== excludeUid) {
      const ws = users.get(uid);
      if (ws) enviar(ws, obj);
    }
  });
}

function leaveRoom(uid) {
  const ws = users.get(uid);
  if (!ws || !ws.roomId) return;
  const roomId = ws.roomId;
  const room = rooms.get(roomId);
  if (room) {
    room.users.delete(uid);
    broadcastRoom(roomId, { type: 'user_left', uid: uid, roomId: roomId }, uid);
    if (room.users.size === 0) {
      rooms.delete(roomId);
    } else {
      broadcastRoom(roomId, { type: 'room_users', roomId: roomId, users: getRoomUsers(roomId) }, null);
    }
  }
  ws.roomId = null;
}

wss.on('connection', (ws) => {
  let uid = null;

  ws.on('message', (data, isBinary) => {
    const binario = (typeof isBinary === 'boolean') ? isBinary : (typeof data !== 'string');

    if (!binario) {
      let msg = null;
      try {
        msg = JSON.parse(data.toString());
      } catch (e) {
        return;
      }

      if (msg.type === 'register') {
        uid = String(msg.uid);
        users.set(uid, ws);
        ws.uid = uid;
        ws.roomId = null;
        enviar(ws, { type: 'welcome', uid: uid });
        return;
      }

      if (!uid) return;

      if (msg.type === 'create_room') {
        leaveRoom(uid);
        let roomId = gerarRoomId();
        while (rooms.has(roomId)) roomId = gerarRoomId();
        const room = { owner: uid, users: new Set([uid]) };
        rooms.set(roomId, room);
        ws.roomId = roomId;
        enviar(ws, { type: 'room_created', roomId: roomId, users: [uid] });
        return;
      }

      if (msg.type === 'join_room') {
        const roomId = String(msg.roomId || '').toUpperCase();
        const room = rooms.get(roomId);
        if (!room) {
          enviar(ws, { type: 'error', message: 'Sala não encontrada' });
          return;
        }
        if (room.users.size >= MAX_USERS_PER_ROOM) {
          enviar(ws, { type: 'error', message: 'Sala cheia (máx 5)' });
          return;
        }
        if (room.users.has(uid)) {
          enviar(ws, { type: 'room_joined', roomId: roomId, users: getRoomUsers(roomId) });
          return;
        }
        leaveRoom(uid);
        room.users.add(uid);
        ws.roomId = roomId;
        broadcastRoom(roomId, { type: 'user_joined', uid: uid, roomId: roomId }, uid);
        const userList = getRoomUsers(roomId);
        enviar(ws, { type: 'room_joined', roomId: roomId, users: userList });
        broadcastRoom(roomId, { type: 'room_users', roomId: roomId, users: userList }, null);
        return;
      }

      if (msg.type === 'leave_room') {
        leaveRoom(uid);
        enviar(ws, { type: 'room_left' });
        return;
      }

      if (msg.type === 'hangup') {
        leaveRoom(uid);
        return;
      }

      if (msg.type === 'heartbeat') return;

    } else {
      if (ws.roomId) {
        const room = rooms.get(ws.roomId);
        if (room) {
          room.users.forEach(otherUid => {
            if (otherUid !== uid) {
              const other = users.get(otherUid);
              if (other && other.readyState === WebSocket.OPEN) {
                other.send(data, { binary: true });
              }
            }
          });
        }
      }
    }
  });

  ws.on('close', () => {
    if (uid) {
      leaveRoom(uid);
      if (users.get(uid) === ws) {
        users.delete(uid);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log('Servidor de salas rodando na porta ' + PORT);
});
