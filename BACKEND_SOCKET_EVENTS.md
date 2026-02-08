# Backend Socket Events for Online & Typing (WhatsApp-like)

The frontend shows **Online** / **typing...** only when the backend emits these events. Add the following **inside** your existing `io.on('connection', (socket) => { ... })` block.

## 1. Update your `joinChat` handler

Store `userId` on the socket and broadcast that this user is online:

```js
socket.on('joinChat', (data) => {
  const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
  if (!roomId) return;
  socket.userId = data.userId;   // required for typing & disconnect
  socket.join(roomId);
  io.emit('userOnline', { userId: data.userId });
  console.log(`User joined chat room: ${roomId}`);
});
```

## 2. Update your `disconnect` handler

When a user disconnects, tell everyone they went offline:

```js
socket.on('disconnect', () => {
  if (socket.userId) {
    io.emit('userOffline', { userId: socket.userId });
  }
  console.log('a user disconnected');
});
```

## 3. Add typing handlers (required for "typing..." to show)

When one user types, the other must receive `userTyping` / `userStoppedTyping`:

```js
  socket.on('typing', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    const who = data.userId || socket.userId;
    if (who) socket.to(roomId).emit('userTyping', { userId: who });
  });

  socket.on('stopTyping', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    const who = data.userId || socket.userId;
    if (who) socket.to(roomId).emit('userStoppedTyping', { userId: who });
  });
```

**Important:** Event names must be exactly: `userOnline`, `userOffline`, `userTyping`, `userStoppedTyping`. The frontend sends `typing` and `stopTyping` with `{ roomId, userId, targetUserId }` — use `data.userId` so "typing..." works even without `socket.userId`.

## 4. Full example (merge with your code)

```js
function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('--');
}

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinChat', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    socket.userId = data.userId;
    socket.join(roomId);
    // Only this user came online — emit for this userId only (not for everyone!)
    io.emit('userOnline', { userId: data.userId });
    console.log(`User joined chat room: ${roomId}`);
  });

  socket.on('typing', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    const whoIsTyping = data.userId || socket.userId;
    if (whoIsTyping) socket.to(roomId).emit('userTyping', { userId: whoIsTyping });
  });

  socket.on('stopTyping', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    const whoStopped = data.userId || socket.userId;
    if (whoStopped) socket.to(roomId).emit('userStoppedTyping', { userId: whoStopped });
  });

  socket.on('sendMessage', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    socket.to(roomId).emit('receiveMessage', data.message);
  });

  socket.on('leaveChat', (data) => {
    const roomId = data.roomId || getRoomId(data.userId, data.targetUserId);
    if (!roomId) return;
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    if (socket.userId) io.emit('userOffline', { userId: socket.userId });
    console.log('a user disconnected');
  });
});
```

After adding these, restart your backend. Then the other user will show **Online** (and green dot) and **typing...** when they type.
