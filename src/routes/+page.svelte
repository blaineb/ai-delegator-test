<script>
  import { useChat } from "ai/svelte";
  import { marked } from 'marked'; // markdown thingy
  // import { nanoid } from 'ai'

  const { input, handleSubmit, messages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        role: "system",
        content: "You are a helpful assistant to a sales person in Slack. Your job is to classify a request as being about whether the request is about how to set up solutions for their company, to accomplish a task, or for general information or creatitivity. A request can only be one of those 3. If it's accomplish a task, and it can be accomplished with an available tool, then just accomplish the task instead. Otherwise, answer only with the name of the category."
      }
    ],
    onResponse: (response) => {
      console.log("RESPONSE DEBUG");
      console.log(response);
    },
    onFinish: (message) => {
      console.log("MESSAGE DEBUG")
      console.log(message, message.finish_reason);
    }
  });

  let textarea;
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Multi-assistant" />
</svelte:head>

<section>
  <header>
    <h1>Chat</h1>
  </header>
  <div id="conversation">
    {#each $messages as message}
      <div class="message">
        <div class="avatar"></div>
        <div class="content">
          <div class="role">{message.role}</div>
          <div class="content">{@html marked(message.content)}</div>
        </div>
      </div>
    {/each}
  </div>
  <form on:submit={handleSubmit}>
    <textarea
      bind:this={textarea}
      bind:value={$input}
      style="height: 1em; overflow: hidden;"
    ></textarea>
    <!-- on:keydown={handleKeyDown} -->
    <button class="primary" type="submit">Send</button>
  </form>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  #conversation {
    flex-grow: 1;
    overflow: auto;
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .message {
    display: flex;
    gap: 16px;
  }
  .message .avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    background-color: #ededed;
    border-radius: 6px;
  }
  .message .role {
    font-weight: bold;
  }
  header {
    height: 50px;
    border-bottom: 1px solid #ededed;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 16px;
  }
  h1 {
    width: 100%;
    font-size: 18px;
  }
  form {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 16px;
    font-size: 15px;
    position: relative;
  }
  textarea {
    min-height: 45px;
    padding-right: 80px;
  }
  button {
    position: absolute;
    display: inline-block;
    width: auto;
    bottom: 20px;
    right: 20px;
  }
</style>
