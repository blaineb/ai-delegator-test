<script>
	import { useChat } from 'ai/svelte';
	import './global.css';

	const { input, handleSubmit, messages } = useChat()
</script>

<svelte:head>
	<title>Layout Page</title>
	<meta name="description" content="Svelte layout page" />
</svelte:head>

<div id="top-bar">
	<h1>Multiple assistants with skills proof of concept</h1>
</div>

<div id="main-layout">
	<div id="side-nav" class="panel">
		<h2>Assistants</h2>
	</div>

	<div id="main-page">
		<slot />
	</div>

	<div id="right-panel" class="panel">
		<h2>Right Panel</h2>
	</div>
</div>

<style>  
	#top-bar, #side-nav, #main-page, #right-panel {
		padding: 28px;
    display: flex;
		box-sizing: border-box;
	}
	#side-nav, #main-page, #right-panel {
		height: calc(100vh - 44px);
	}
	.panel { width: 20%; min-width: 240px;}
  h1 { font-size: 18px; line-height: 1; margin: 0; margin-bottom: 2px; }
	#side-nav * { color: white; }
	h2 { font-size: 18px; line-height: 1; margin: 0;}
  #top-bar { 
		align-items: center; 
		justify-content:center; 
		text-align: center;
		color: white!important;
		box-sizing: border-box;
		padding: 8px 16px;
		height: 40px;
	}
	#top-bar h1 { color: rgba(255,255,255,.7);}
	#side-nav { background-color: var(--nav-bg);}
	#main-layout {
		height: calc(100vh - 44px);
		border-radius: 6px;
		overflow: hidden;
		display: flex;
		margin: 0 4px 4px;
		box-sizing: border-box;
	}
	#main-page {
		background-color: var(--white);
		flex-grow: 1;
		align-items:flex-start;
		padding: 0;
	}
	#right-panel { background-color: white; box-shadow: 0 -2px 8px rgba(0,0,0,.1)}


	h1 {
		width: 100%;
	}
</style>
