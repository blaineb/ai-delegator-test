export const tools = [{
  type: 'function',
  function: {
    name: 'get_current_weather',
    description: 'Get the current weather',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
        },
        format: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description:
            'The temperature unit to use. Infer this from the users location.',
        },
      },
      required: ['location', 'format'],
    },
  },
}]

async function get_current_weather(location, format) {
  const weatherData = {
    location: location,
    temperature: 20, // Example temperature data
    unit: format === 'fahrenheit' ? 'F' : 'C' // Determine the unit based on the format argument
  };
  return weatherData;
}



export async function runTool(name, args) {
  switch (name) {
    case "get_current_weather":
      return await get_current_weather();
    // case "get_story":
    //   return await get_story(args["id"]);
    // case "get_story_with_comments":
    //   return await get_story_with_comments(args["id"]);
    // case "summarize_top_story":
    //   return await summarize_top_story();
  }
}