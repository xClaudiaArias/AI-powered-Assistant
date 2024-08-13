'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello, I am a support assistant. How can I help you today?'
    }
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages
  
    // Immediately add the user's message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
  
    setMessage(''); // Clear the input field
    setIsLoading(true);
  
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds
  
    while (retryCount < maxRetries) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([...messages, { role: 'user', content: message }]),
        });
  
        if (response.status === 429) {
          retryCount++;
          console.warn(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
  
        // Read and append the assistant's message incrementally
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setMessages((prevMessages) => {
            let lastMessage = prevMessages[prevMessages.length - 1];
            let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
        }
        break; // Exit the loop on success
  
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('Error:', error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  

  const handleKeyPress = (event) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box width={"100vw"} height={"100vh"} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <Stack direction={'column'} width={'500px'} height={'700px'} border={'1px solid black'} padding={2} spacing={3} backgroundColor={'#030126'}>
        <Stack direction={'column'} spacing={2} flexGrow={1} overflow={'auto'} maxHeight={'100%'} >
          {
            messages.map((message, i) => {
              return (
                <Box key={i} display='flex' justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                  <Box bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'} color={'white'} borderRadius={16} p={3}>
                    {message.role === 'assistant' ? (
                      <Box display={'flex'} alignItems={'center'} gap={'20px'}>
                        <SmartToyIcon /> {message.content}
                      </Box>
                    ) : (
                      <Box display={'flex'} alignItems={'center'} gap={'20px'}>
                        <PersonIcon /> {message.content}
                      </Box>
                    )}
                  </Box>
                </Box>
              )
            })
          }
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiInputBase-root': {
                color: 'white', // Text color
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Label color
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Border color
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'lightgray', // Border color on hover
              },
            }}
            InputProps={{
              style: {
                color: 'white', // Text color inside the input
              },
            }}
          />
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}>
            { isLoading ? 'sending' : <SendIcon /> }
          </Button>
        </Stack>

      </Stack>
    </Box>
  )
}
