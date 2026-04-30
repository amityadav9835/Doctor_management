import crypto from "crypto";

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const rooms = new Map();

const encodeFrame = (payload) => {
  const data = Buffer.from(JSON.stringify(payload));
  const header =
    data.length < 126
      ? Buffer.from([0x81, data.length])
      : Buffer.from([0x81, 126, data.length >> 8, data.length & 255]);

  return Buffer.concat([header, data]);
};

const decodeFrames = (buffer) => {
  const messages = [];
  let offset = 0;

  while (offset + 2 <= buffer.length) {
    const secondByte = buffer[offset + 1];
    let length = secondByte & 0x7f;
    let lengthOffset = 2;

    if (length === 126) {
      if (offset + 4 > buffer.length) break;
      length = buffer.readUInt16BE(offset + 2);
      lengthOffset = 4;
    }

    if (length === 127) {
      break;
    }

    const masked = Boolean(secondByte & 0x80);
    const maskOffset = offset + lengthOffset;
    const dataOffset = maskOffset + (masked ? 4 : 0);
    const frameEnd = dataOffset + length;

    if (frameEnd > buffer.length) break;

    const payload = Buffer.alloc(length);
    const mask = masked ? buffer.subarray(maskOffset, maskOffset + 4) : null;

    for (let index = 0; index < length; index += 1) {
      payload[index] = masked
        ? buffer[dataOffset + index] ^ mask[index % 4]
        : buffer[dataOffset + index];
    }

    messages.push(payload.toString("utf8"));
    offset = frameEnd;
  }

  return messages;
};

const send = (socket, payload) => {
  if (!socket.destroyed) {
    socket.write(encodeFrame(payload));
  }
};

const leaveRoom = (socket) => {
  const roomId = socket.videoRoomId;

  if (!roomId || !rooms.has(roomId)) return;

  const peers = rooms.get(roomId);
  peers.delete(socket);

  peers.forEach((peer) =>
    send(peer, {
      type: "peer-left",
      role: socket.videoRole,
    })
  );

  if (peers.size === 0) {
    rooms.delete(roomId);
  }
};

const joinRoom = (socket, payload) => {
  const roomId = String(payload.roomId || "").trim();
  const role = String(payload.role || "guest").trim();

  if (!roomId) {
    send(socket, { type: "error", message: "Missing video room" });
    return;
  }

  leaveRoom(socket);

  socket.videoRoomId = roomId;
  socket.videoRole = role;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  const peers = rooms.get(roomId);

  peers.forEach((peer) => {
    send(peer, { type: "peer-joined", role });
    send(socket, { type: "peer-joined", role: peer.videoRole });
  });

  peers.add(socket);
  send(socket, { type: "joined", roomId, peers: peers.size - 1 });
};

const relayToRoom = (socket, payload) => {
  const peers = rooms.get(socket.videoRoomId);

  if (!peers) return;

  peers.forEach((peer) => {
    if (peer !== socket) {
      send(peer, {
        ...payload,
        role: socket.videoRole,
      });
    }
  });
};

export const attachSignalingServer = (server) => {
  server.on("upgrade", (req, socket) => {
    const url = new URL(req.url || "", "http://localhost");

    if (url.pathname !== "/video-signaling") {
      socket.destroy();
      return;
    }

    const key = req.headers["sec-websocket-key"];

    if (!key) {
      socket.destroy();
      return;
    }

    const accept = crypto.createHash("sha1").update(`${key}${GUID}`).digest("base64");

    socket.write(
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${accept}`,
        "",
        "",
      ].join("\r\n")
    );

    socket.on("data", (buffer) => {
      decodeFrames(buffer).forEach((message) => {
        try {
          const payload = JSON.parse(message);

          if (payload.type === "join") {
            joinRoom(socket, payload);
            return;
          }

          relayToRoom(socket, payload);
        } catch (error) {
          send(socket, { type: "error", message: error.message });
        }
      });
    });

    socket.on("close", () => leaveRoom(socket));
    socket.on("end", () => leaveRoom(socket));
    socket.on("error", () => leaveRoom(socket));
  });
};
