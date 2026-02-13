<script>
	import { responseStore } from '../stores';

	// Determine status class
	$: statusClass =
		$responseStore?.status >= 500 ? 'error'
		: $responseStore?.status >= 400 ? 'warn'
		: $responseStore?.status >= 200 ? 'ok'
		: '';

	// Pretty JSON or fallback to plain text
	$: prettyBody = '';
	$: if ($responseStore?.body) {
		if (typeof $responseStore.body === 'object') {
			prettyBody = JSON.stringify($responseStore.body, null, 2);
		} else {
			try {
				prettyBody = JSON.stringify(JSON.parse($responseStore.body), null, 2);
			} catch {
				prettyBody = $responseStore.body;
			}
		}
	}
</script>

<div class="response">
	{#if !$responseStore}
		<div class="empty">
			<div class="empty-icon">↑</div>
			<div class="empty-text">Enter a URL and click Send to get a response</div>
		</div>

	{:else if $responseStore.loading}
		<div class="loading">
			<div class="spinner"></div>
			<span>Sending Request...</span>
		</div>

	{:else if $responseStore.error}
		<div class="error-box">
			<span class="label">Error:</span>
			<span>{$responseStore.error}</span>
		</div>

	{:else}
		<div class="meta">
			<div class="meta-item">
				<span class="label">Status:</span>
				<span class="status {statusClass}">{$responseStore.status} {$responseStore.statusText || ''}</span>
			</div>
			{#if $responseStore.time}
				<div class="meta-item">
					<span class="label">Time:</span>
					<span class="value">{$responseStore.time} ms</span>
				</div>
			{/if}
		</div>

		<div class="body-container">
			<pre class="body">{prettyBody}</pre>
		</div>
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

	/* ---------- States ---------- */

	.empty, .loading {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--muted);
		gap: 12px;
	}

	.empty-icon {
		font-size: 24px;
		opacity: 0.5;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--highlight-soft);
		border-top-color: var(--highlight);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* ---------- Error ---------- */

	.error-box {
		padding: 16px;
		color: var(--danger);
		background: rgba(239, 68, 68, 0.05);
		border-bottom: 1px solid var(--border);
		font-size: 13px;
	}

	.error-box .label {
		font-weight: 600;
		margin-right: 8px;
	}

	/* ---------- Meta ---------- */

	.meta {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--border);
		background: var(--panel);
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
	}

	.meta-item .label {
		color: var(--muted);
		font-weight: 500;
	}

	.status {
		font-weight: 600;
	}

	.status.ok { color: var(--ok); }
	.status.warn { color: var(--warn); }
	.status.error { color: var(--danger); }

	/* ---------- Body ---------- */

	.body-container {
		flex: 1;
		overflow: auto;
		background: var(--panel-2);
	}

	.body {
		margin: 0;
		padding: 16px;
		color: var(--text);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.6;
		white-space: pre;
	}
</style>
