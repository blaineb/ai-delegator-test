export const tools = [
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
    }
  },
  {
    type: "function",
    function: {
      name: "getSalesforceRecords",
      description: "Get information on deals including their name, owner, deal size (amount), stage, channel, and account",
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
        }
      },
    }
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
    }
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
    }
  },
];