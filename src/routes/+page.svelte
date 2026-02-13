<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import RequestBuilder from '$lib/components/RequestBuilder.svelte';
	import ResponseViewer from '$lib/components/ResponseViewer.svelte';
	import { isHydrated } from '$lib/stores';
</script>

<div class="app">
	{#if $isHydrated}
		<Sidebar />
		<div class="main">
			<RequestBuilder />
			<ResponseViewer />
		</div>
	{:else}
		<div class="loading-screen">
			<div class="loader"></div>
		</div>
	{/if}
</div>

<style>
	.app {
		display: flex;
		height: 100vh;
		background: var(--bg);
	}

	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.loading-screen {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loader {
		width: 32px;
		height: 32px;
		border: 3px solid var(--highlight-soft);
		border-top-color: var(--highlight);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>