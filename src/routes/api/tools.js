import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: "My TOTALLY REAL key",
  dangerouslyAllowBrowser: true,
});
const slackbotID = "asst_meFVz4J9xZqLgu7x0mxvp0Yo"; // slackbot assistant?
const einsteinID = "asst_8Ituh5QQTm08BavFaUwOzjyl"; // Einstein assistant

export const greenTechChannel = [
  {
    author: "Carmen",
    message: "The meeting with the potential client went well.",
  },
  {
    author: "Arcadio",
    message: "That's great! Did we discuss the price range?",
  },
  {
    author: "Lisa",
    message: "Yes, they agreed to our initial proposal of $500,000.",
  },
  {
    author: "Carmen",
    message: "That's a good start. We should prepare for the negotiation.",
  },
  {
    author: "Arcadio",
    message: "Agreed. Let's also consider a counter-offer strategy.",
  },
  {
    author: "Lisa",
    message:
      "Update: The client is open to increasing their budget to $600,000.",
  },
  {
    author: "Carmen",
    message:
      "That's great news! We can adjust our negotiation strategy accordingly.",
  },
  {
    author: "Arcadio",
    message: "We're ready for the negotiation. Let's close this deal!",
  },
];

export const salesforceDB = [
  {
    name: "GreenTech",
    dealSize: 500000,
    channel: "greenTechChannel",
    ownerName: "Carmen",
    stage: "Negotiation",
    daysSinceLastContact: 2,
  },
  {
    name: "Golden Eagle Agreement",
    dealSize: 600000,
    ownerName: "Arcadio",
    stage: "Proposal",
    daysSinceLastContact: 5,
  },
  {
    name: "Silver Fox Contract",
    dealSize: 700000,
    ownerName: "Lisa",
    stage: "Qualification",
    daysSinceLastContact: 7,
  },
  {
    name: "Red Panda Negotiation",
    dealSize: 800000,
    ownerName: "Carmen",
    stage: "Closed Won",
    daysSinceLastContact: 10,
  },
  {
    name: "Green Turtle Proposal",
    dealSize: 900000,
    ownerName: "Arcadio",
    stage: "Closed Lost",
    daysSinceLastContact: 15,
  },
];

export async function summarizeChannel(channel) {
  console.log("summarizeChannel called with", channel);
  let channelData;
  try {
    if (channel === "greenTechChannel") {
      channelData = greenTechChannel;
    }
  } catch (error) {
    console.error(
      "Failed to parse channel data. Please ensure it's a valid JSON string."
    );
    throw error;
  }
  messages.push({
    role: "user",
    content: `Summarize important updates from this channel's content.: ${channelData}`,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages,
    tools: { summarizeChannel },
  });
  return summary;
}

export async function getSalesforceRecords({
  name,
  ownerName,
  accountName,
  dealSize,
  stage,
} = {}) {
  return salesforceDB.filter((record) => {
    console.log("Name ask:" + name);
    console.log("Record name" + record.name);
    return (
      (!name || record.name.toLowerCase() === name.toLowerCase()) &&
      (!ownerName ||
        record.ownerName.toLowerCase() === ownerName.toLowerCase()) &&
      (!accountName ||
        record.name.toLowerCase() === accountName.toLowerCase()) &&
      (!dealSize || record.dealSize === dealSize) &&
      (!stage || record.stage.toLowerCase() === stage.toLowerCase())
    );
  });
}

export async function generalKnowledge(query) {
  let thread = await openai.beta.threads.create();
  let message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `You are a helpful assistant. Please respond to this in a concise and helpful way: ${query}`,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: slackbotID,
    // instructions: "Return the updated information both as a simple summary in a sentence, as well as the updated information as JSON with attributes of field, oldValue, and newValue",
  });

  let checkInterval;

  const checkRunStatus = async (threadId, runId) => {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      clearInterval(checkInterval);
      console.log("Run is completed.");
      let threadUpdate = await openai.beta.threads.messages.list(threadId);
      console.log(
        "The response:" + JSON.stringify(threadUpdate.data[0].content, null, 2)
      );
    } else {
      console.log("Run is not completed yet.");
    }
  };

  checkInterval = setInterval(() => {
    checkRunStatus(thread.id, run.id);
  }, 2000);
}

export async function updateDeal(name) {
  console.log("Name:" + name);
  let dealData = await getSalesforceRecords({ name: name });
  console.log(JSON.stringify(dealData, null, 2));
  let channelData = dealData[0].channel;

  let thread = await openai.beta.threads.create();
  let message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content:
      "Look through the channel's data and find any updates to the deal that need to happen to the data." +
      `Here is the existing info we have for the deal: ${JSON.stringify(
        dealData
      )}` +
      `And here is the channel information: ${JSON.stringify(
        eval(channelData)
      )}`,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: einsteinID,
    instructions:
      "Return the updated information both as a simple summary in a sentence, as well as the updated information as JSON with attributes of field, oldValue, and newValue",
  });

  let checkInterval;

  const checkRunStatus = async (threadId, runId) => {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      clearInterval(checkInterval);
      console.log("Run is completed.");
      let threadUpdate = await openai.beta.threads.messages.list(threadId);
      return threadUpdate[0];
      console.log(
        "The response:" + JSON.stringify(threadUpdate.data[0].content, null, 2)
      );
    } else {
      console.log("Run is not completed yet.");
    }
  };

  checkInterval = setInterval(() => {
    checkRunStatus(thread.id, run.id);
  }, 2000);
}

export const manifest = [
  {
    type: "function",
    function: {
      name: "summarizeChannel",
      description: "Summarize the content of a given channel",
      parameters: {
        type: "object",
        properties: {
          channel: {
            type: "string",
          },
        },
        required: ["channel"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getSalesforceRecords",
      description:
        "Get information on deals including their name, owner, deal size (amount), stage, channel, and account",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          ownerName: {
            type: "string",
          },
          accountName: {
            type: "string",
          },
          dealSize: {
            type: "number",
          },
          stage: {
            type: "string",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generalKnowledge",
      description: "Provide general knowledge based on a given question",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
        },
        required: ["question"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateDeal",
      description: "Update a deal in Salesforce based on channel data",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
        required: ["name"],
      },
    },
  },
];
