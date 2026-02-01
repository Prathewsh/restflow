<script>
	export let collections = ['Sample APIs'];
	export let active = collections[0];
</script>

<div class="sidebar">
	<div class="header">
		<span class="logo">RestFlow</span>
	</div>

	<div class="section">
		<h3>Collections</h3>

		{#each collections as col}
			<div
				class="item {active === col ? 'active' : ''}">
				{col}
			</div>
		{/each}
	</div>
</div>

<style>
	.sidebar {
		width: 220px;
		background: var(--panel);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	/* ---------- Header ---------- */

	.header {
		padding: 14px 12px;
		border-bottom: 1px solid var(--border);
	}

	.logo {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.4px;
		color: var(--text);
	}

	/* ---------- Section ---------- */

	.section {
		padding: 10px 8px;
	}

	h3 {
		margin: 6px 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* ---------- Items ---------- */

	.item {
		padding: 6px 10px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 13px;
		color: var(--text);
		transition: background 0.12s ease, color 0.12s ease;
	}

	.item:hover {
		background: var(--panel-2);
	}

	.item.active {
		background: var(--highlight);
		color: var(--text);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
	}
</style>
