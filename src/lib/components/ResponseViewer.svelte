<script>
	import { responseStore } from '../stores';

	let response;
	responseStore.subscribe(v => response = v);

	// Determine status class
	$: statusClass =
		response?.status >= 500 ? 'error'
		: response?.status >= 400 ? 'warn'
		: response?.status >= 200 ? 'ok'
		: '';

	// Pretty JSON or fallback to plain text
	$: prettyBody = '';
	$: if (response?.body) {
		try {
			prettyBody = JSON.stringify(JSON.parse(response.body), null, 2);
		} catch {
			prettyBody = response.body;
		}
	}
</script>

<div class="response">
	{#if !response}
		<div class="empty">No response yet</div>

	{:else if response.error}
		<div class="error-box">
			<span class="label">Error:</span>
			<span>{response.error}</span>
		</div>

	{:else}
		<div class="meta">
			<span class="status {statusClass}">
				{response.status}
			</span>
		</div>

		<pre class="body">{prettyBody}</pre>
	{/if}
</div>

<style>
	.response {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--bg);
		border-top: 1px solid var(--border);
		overflow: hidden;
	}

	/* ---------- Empty ---------- */

	.empty {
		color: var(--muted);
		font-size: 13px;
		padding: 16px;
	}

	/* ---------- Error ---------- */

	.error-box {
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 12px 16px;
		color: #fecaca;
		background: rgba(239, 68, 68, 0.1);
		border-bottom: 1px solid #3a1f1f;
	}

	.error-box .label {
		font-weight: 600;
		color: #ef4444;
	}

	/* ---------- Meta ---------- */

	.meta {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 1px solid var(--border);
		background: var(--panel);
	}

	.status {
		font-size: 12px;
		padding: 2px 8px;
		border-radius: 999px;
		font-weight: 600;
	}

	.status.ok {
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
	}

	.status.warn {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
	}

	.status.error {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
	}

	/* ---------- Body ---------- */

	.body {
		flex: 1;
		margin: 0;
		padding: 12px;
		background: var(--panel-2);
		color: var(--text);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.6;
		overflow: auto;
		white-space: pre;
		border-radius: 0 0 8px 8px;
	}
</style>
