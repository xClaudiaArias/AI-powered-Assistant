'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
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

  const sendMessage = async () => {
    // code
  }

  return (
    <Box width={"100vw"} height={"100vh"} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <Stack direction={'column'} width={'500px'} height={'700px'} border={'1px solid black'} padding={2} spacing={3} backgroundColor={'#030126'}>
        <Stack direction={'column'} spacing={2} flexGrow={1} overflow={'auto'} maxHeight={'100%'} >
          {
            messages.map((message, i) => {
              <Box key={i} display='flex' justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box bgcolor={'message.role' === 'assistant' ? 'primary.main' : 'secondary.main'} color={'white'} borderRadius={16} p={3}>
                  {message.role === 'assistant' ? (
                    <>
                      <SmartToyIcon /> {message.content}
                    </>
                  ) : (
                    <>
                      <PersonIcon /> {message.content}
                    </>
                  )}
                </Box>
              </Box>
            })
          }
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
          <Button variant="contained">
            <SendIcon />
          </Button>
        </Stack>

      </Stack>
    </Box>
  )
}