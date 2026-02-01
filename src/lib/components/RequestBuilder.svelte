<script>
	import { requestStore, responseStore } from '../stores';
	import { writable, get } from 'svelte/store';

	let request;
	requestStore.subscribe(v => request = v);

	let bodyType = 'raw'; // raw | form
	let formFields = writable([{ key: '', value: '' }]);

	function addField() {
		formFields.update(f => [...f, { key: '', value: '' }]);
	}

	function removeField(i) {
		formFields.update(f => f.filter((_, idx) => idx !== i));
	}

	async function send() {
		try {
			let body;
			let headers = { ...request.headers };

			if (bodyType === 'raw') {
				body = request.body;
			}

			if (bodyType === 'form') {
				const fd = new FormData();
				get(formFields).forEach(f => {
					if (f.key) fd.append(f.key, f.value);
				});
				body = fd;
				delete headers['Content-Type'];
			}

			const res = await fetch(request.url, {
				method: request.method,
				headers,
				body: ['GET', 'HEAD'].includes(request.method) ? null : body
			});

			const text = await res.text();

			responseStore.set({
				status: res.status,
				headers: Object.fromEntries(res.headers.entries()),
				body: text
			});
		} catch (e) {
			responseStore.set({ error: e.message });
		}
	}
</script>

<div class="builder">
	<div class="top">
		<select bind:value={request.method}>
			<option>GET</option>
			<option>POST</option>
			<option>PUT</option>
			<option>DELETE</option>
		</select>

		<input class="url" bind:value={request.url} />
		<button class="send primary" on:click={send}>Send</button>
	</div>

	<div class="tabs">
		<button
			class:active={bodyType === 'raw'}
			on:click={() => bodyType = 'raw'}>
			Raw
		</button>
		<button
			class:active={bodyType === 'form'}
			on:click={() => bodyType = 'form'}>
			Form Data
		</button>
	</div>

	{#if bodyType === 'raw'}
		<textarea
			rows="6"
			placeholder="Raw JSON / Text Body"
			bind:value={request.body}>
		</textarea>
	{:else}
		<div class="form">
			{#each $formFields as field, i}
				<div class="form-row">
					<input placeholder="key" bind:value={field.key} />
					<input placeholder="value" bind:value={field.value} />
					<button class="danger" on:click={() => removeField(i)}>✕</button>
				</div>
			{/each}

			<button class="add" on:click={addField}>
				+ Add Field
			</button>
		</div>
	{/if}
</div>

<style>
	.builder {
		padding: 14px;
		background: var(--panel);
	}

	.top {
		display: flex;
		gap: 8px;
		margin-bottom: 10px;
	}

	.url {
		flex: 1;
		font-family: ui-monospace, monospace;
	}

	.send {
		font-weight: 600;
		color: white;
	}

	.tabs {
		display: flex;
		gap: 12px;
		margin-bottom: 8px;
		border-bottom: 1px solid var(--border);
	}

	.tabs button {
		background: none;
		border: none;
		padding: 6px 2px;
		font-size: 13px;
		color: var(--muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}

	.tabs button:hover {
		color: #3E4043;
	}

	.tabs button.active {
		color: #3E4043;
		border-bottom-color: #3E4043;
	}

	textarea {
		width: 100%;
		font-family: ui-monospace, monospace;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-row {
		display: flex;
		gap: 6px;
	}

	.form-row input {
		flex: 1;
	}
</style>
