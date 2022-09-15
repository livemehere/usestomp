# useStomp hook

This library provides a hook for simple use of stompjs in React

## Discription

```js
const { disconnect, subscribe, unsubscribe, subscriptions, send, isConnected } =
  useStomp({
    brokerURL: SERVER_STOMP_URL,
  });
```

This hook automatically manages the entire React App to be a single websocket connection. So feel free to use hook any components.

- disconnect : Disconnect webscoket from server.
- subscribe : Subscribe sepcific destination
- unsubscribe : Unsubscribe sepcific destination
- subscriptions : Returns all destinations you are currently subscribed to.
- send : Send message with body and headers to specific destination
- isConnected : Returns the current connection status.

## Usage

### Conenct to stomp server

```js
useStomp(
  {
    brokerURL: SERVER_STOMP_URL,
    // Other Config ...
  },
  ()=>{
    // After you're connected, do what you want
  })
);
```

### Subscribe to destination

```js
subscribe(`/room/user/${userId}`, (body) => {
  // Body is Object Changed to JSON
});
```

### Send Message

```js
send("destination", message, headers);
```

### Unsubscribe

```js
useEffect(() => {
  const destination = "/room/1";

  subscribe(destination, (body) => {
    // do anything...
  });

  return () => {
    // Make sure you're subscribed
    if (subscriptions[destination]) {
      unsubscribe(destination);
    }
  };
}, []);
```

### Check Status

```js
console.log(isConnected); // true or false
```
