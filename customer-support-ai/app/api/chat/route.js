import { NextResponse } from "next/server"; // used to create HTTP responses in your API routes.
import OpenAI from "openai";

const systemPrompt = "You are a hiring manager assistant ready to help and train job seekers by interviewing them and offering tips."; //sets the behavior or tone of the AI. 


export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is correctly set up
    }); // This creates an instance of the OpenAI client, use to make requests to the OpenAI API.
    const data = await req.json()

    const completion = await openai.chat.completions.create({ // This sends a request to the OpenAI API to generate a response.
        messages: [{role: 'system', content: systemPrompt}, ...data], // this is an array of messages sent to the AI. The first message is the systemPrompt
        // ..data spreads the user's messages into the array, continuing the conversation.
        model: 'gpt-3.5-turbo',
        stream: true, // enable streaming responses
    })
    const encoder = new TextEncoder()  // Create a TextEncoder to convert strings to Uint8Array
    const stream = new ReadableStream({
        async start(controller) {
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                if (content) {
                    const text = encoder.encode(content) // Encode the content to Uint8Array
                    controller.enqueue(text) // Enqueue the encoded text to the stream
                }
                }
            } catch (err) {
                controller.error(err) // Handle any errors that occur during streaming
            } finally {
                controller.close() // Close the stream when done
            }
            },
        })
    
    return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    }); // Return the stream as the response
}

