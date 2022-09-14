# useStomp hook

> spring 서버와 소켓연결을 하기위해서 stomp를 사용할 수 있습니다. 이 라이브러리는 react-hook 으로 어떤 의존성없이 빠르게 사용할 수있도록 제공합니다.

## Example

> useStomp를 활용하여 커스텀한 useChatStomp를 만든 예시입니다.

```ts
interface ChatResponse {
  body: Chat;
  headers: { [key: string]: any };
  statusCode: string;
  statusCodeValue: number;
}

export function useChatStomp(roomId: string | number, callback?: any) {
  const {
    user: { id: userId },
  } = useCurrentUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const firstChatRef = useRef<Chat | undefined>(undefined);

  const { subscribe, isConnected, unsubscribe, send, subscriptions } =
    useStomp(SERVER_STOMP_URL);

  const setFirstChatRef = useCallback((chat: Chat) => {
    firstChatRef.current = chat;
  }, []);

  const sendMessage = useCallback((message: string) => {
    send(
      `/send/${roomId}`,
      { message },
      {
        accessToken: getItemFromLS("accessToken") || "",
      }
    );
  }, []);

  useEffect(() => {
    callback && callback();
  }, [chats]);

  useEffect(() => {
    if (!userId || !isConnected || !roomId) return;

    subscribe<ChatResponse>(`/room/${roomId}`, (body) => {
      setChats((prev) => [...prev, body.body]);
    });

    return () => {
      if (subscriptions[`/room/${roomId}`]) {
        unsubscribe(`/room/${roomId}`);
      }
    };
  }, [userId, isConnected, roomId]);

  return {
    setFirstChatRef,
    chats,
    setChats,
    sendMessage,
    firstChatRef,
  };
}
```
