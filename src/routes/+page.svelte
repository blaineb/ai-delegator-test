<script>
  import { useChat } from "ai/svelte";

  const { input, handleSubmit, messages, append } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        role: "system",
        content: `Your job is to use the available functions. Only use the functions you have been provided with.`,
      },
    ],
  });
  let textarea;

  function summarizeChannel(channel) {
    append();
  }

  // function handleKeyDown(e) {
  //   if (e.key === "Enter") {
  //     if (e.shiftKey) {
  //       // Insert newline at cursor position
  //       const start = textarea.selectionStart;
  //       const end = textarea.selectionEnd;
  //       input.set(input.substring(0, start) + "\n" + input.substring(end));
  //       textarea.selectionStart = textarea.selectionEnd = start + 1;
  //       autogrow(e);
  //     } else {
  //       // Submit form
  //       e.preventDefault();
  //       handleFormSubmit(e);
  //     }
  //   }
  // }

  function handleFormSubmit(e) {
    handleSubmit(e);
    textarea.value = "";
    autogrow(e);
    textarea.style.height = "auto";
    textarea.style.overflow = "hidden";
    textarea.style.height = "1em";
  }
  function autogrow(e) {
    e.target.style.height = e.target.scrollHeight + "px";
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
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
          <div class="content">{message.content}</div>
        </div>
      </div>
    {/each}
  </div>
  <form on:submit={handleFormSubmit}>
    <textarea
      bind:this={textarea}
      bind:value={$input}
      style="height: 1em; overflow: hidden;"
      on:input={autogrow}
      on:blur={autogrow}
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
