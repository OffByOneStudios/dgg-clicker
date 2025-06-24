import { Box, Text, HStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { List, AutoSizer } from 'react-virtualized';

const FAKE_USERS = [
  { name: 'PepeHappy', avatar: '/img/char/pepe/happy.png' },
  { name: 'PepeSad', avatar: '/img/char/pepe/crying.png' },
  { name: 'PepeScared', avatar: '/img/char/pepe/scared.png' },
  { name: 'PepeDisappointed', avatar: '/img/char/pepe/dissapointed.png' },
];

const MAX_HISTORY = 40;
const MESSAGE_INTERVAL = 2800; // ms

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ user: string; avatar: string; text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load corpus and start worker
    workerRef.current = new Worker(new URL('./markovWorker.js', import.meta.url));
    fetch('/txt/chat_corpus.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        workerRef.current?.postMessage({ type: 'train', data: lines });
      });
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'trained') setReady(true);
      if (e.data.type === 'message') {
        const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
        setMessages(msgs => {
          const next = [...msgs, { user: user.name, avatar: user.avatar, text: e.data.data }];
          return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
        });
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      workerRef.current?.postMessage({ type: 'generate' });
    }, MESSAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      bg="gray.800"
      borderRadius="md"
      borderWidth="2px"
      borderColor="gray.600"
      boxShadow="md"
      w="320px"
      p={3}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Text fontWeight="bold" color="white" mb={2}>Chat</Text>
      <Box ref={scrollRef} flex={1} overflowY="auto" bg="gray.900" borderRadius="sm" p={0}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <List
              width={300}
              height={height}
              rowCount={messages.length}
              rowHeight={28}
              rowRenderer={({ index, key, style }) => {
                const msg = messages[index];
                return (
                  <div key={key} style={style}>
                    <HStack align="start" mb={1} gap={2}>
                      <Text color="blue.200" fontWeight="bold" fontSize="sm">{msg.user}</Text>
                      <Text color="gray.100" fontSize="sm">{msg.text}</Text>
                    </HStack>
                  </div>
                );
              }}
            />
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
}
