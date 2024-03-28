import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
// import greenTechChannel from '/data/greenTechChannel.js';
// import salesforceDB from '/data/salesforceDB.js';
import {
  summarizeChannel,
  getSalesforceRecords,
  generalKnowledge,
  updateDeal,
  manifest,
  salesforceDB,
  greenTechChannel,
} from "../tools.js";
// import { tools } from '/data/tools-manifest.js';

// OpenAI basics
const openai = new OpenAI({
  apiKey: "My TOTALLY REAL key",
  dangerouslyAllowBrowser: true,
});
const slackbotID = "asst_meFVz4J9xZqLgu7x0mxvp0Yo"; // slackbot assistant?
const einsteinID = "asst_8Ituh5QQTm08BavFaUwOzjyl"; // Einstein assistant

const availableTools = {
  summarizeChannel,
  getSalesforceRecords,
  generalKnowledge,
  updateDeal,
};
console.log("TOOLS");
console.log(manifest);

async function pushMessage(input, user = "user") {
  messages.push({
    role: user,
    content: input,
  });
}

export const POST = async ({ request }) => {
  const { messages } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      tools: manifest,
      tool_choice: "auto",
    });

    console.log("response", response);

    console.log("message", response.choices[0].message);

    const { finish_reason, message } = response.choices[0];

    if (finish_reason === "tool_calls" && message.tool_calls) {
      const functionName = message.tool_calls[0].function.name; // Get the name
      console.log(`Function name: ${functionName}`);
      const functionToCall = availableTools[functionName]; // Find the function
      console.log(`Function to call: ${functionToCall}`);
      if (!functionToCall) {
        console.error(`Function ${functionName} not found in availableTools`);
      } else {
        console.log(`Function ${functionName} found in availableTools`);
      }
      const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
      const functionArgsArr = Object.values(functionArgs); // Get the args
      let functionResponse;
      if (functionToCall) {
        functionResponse = await functionToCall.apply(null, functionArgsArr);

        // functionRespons = greenTechChannel;
      } else {
        console.error(
          `Cannot call apply on undefined function ${functionName}`
        );
      }
      // messages.push({
      //   role: "function",
      //   name: functionName,
      //   content: `The result of the last function was this: ${JSON.stringify(
      //     functionResponse
      //   )}`,
      // });
    } else if (finish_reason === "stop") {
      console.log("STOP called");
      messages.push(message);
      // return response;
      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    }
  } catch (error) {
    console.error(error);
  }
};
