import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, experimental_StreamData } from 'ai';
import { tools, runTool } from "./tools";
import { env } from '$env/dynamic/private';
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY || '', });

// Define an asynchronous POST function to handle incoming requests
export async function POST({ request }) {
  const { messages } = await request.json();
  const model = 'gpt-3.5-turbo-1106';

  const response = await openai.chat.completions.create({
    model, stream: true, messages, tools
  });

  const data = new experimental_StreamData();

  const stream = OpenAIStream(response, {
    experimental_onToolCall: async (call, appendToolCallMessage) => {
      for (const toolCall of call.tools) {
        console.log("TOOL", toolCall.func.name, toolCall.func.arguments);
        const result = await runTool(toolCall.func.name, toolCall.func.arguments);

          // Append the tool call result to the chat messages
          const newMessages = appendToolCallMessage({
            tool_call_id: toolCall.id,
            function_name: toolCall.func.name,
            tool_call_result: result,
          });

          // Create a new chat completion with the updated messages
          return openai.chat.completions.create({
            messages: [...messages, ...newMessages], // Combine the original and new messages
            model, // The model specified above
            stream: true, // Continue streaming
            tools, // The functions available for the chat
          });
        }
    },
    onCompletion: (completion) => {
      console.log('completion:', completion); // Log the completion for debugging
    },
    onFinal: () => {
      data.close(); // Close the stream data object
    },
    experimental_streamData: true, // Enable experimental features for stream data
  });

  // Append a new message to the stream data object
  // console.log("DATA");
  // console.log(data);
  // data.append({
  //   text: 'Hello, how are you?', // The content of the message
  // });
  // console.log(data);

  // Return a new streaming text response with the stream and data objects
  return new StreamingTextResponse(stream, {}, data);
}
