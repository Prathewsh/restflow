<script>
	import { collectionsStore, activeCollectionId, activeRequestId, updateActiveRequest, responseStore } from '../stores';
	import { derived, writable, get } from 'svelte/store';

	const currentRequestStore = derived(
		[collectionsStore, activeCollectionId, activeRequestId],
		([$cols, $colId, $reqId]) => {
			const col = $cols.find((c) => c.id === $colId);
			if (!col) return null;
			return col.requests.find((r) => r.id === $reqId);
		}
	);

	let request = {
		method: 'GET',
		url: '',
		body: '',
		bodyType: 'raw',
		headers: {}
	};

	let formFields = [];

	$: if ($currentRequestStore) {
		// Update local state when the active request changes in the store
		// but only if it's a different request or we don't have one yet
		if (request.id !== $currentRequestStore.id) {
			request = { ...$currentRequestStore };
			// Initialize form fields if bodyType is form
			if (request.bodyType === 'form' && typeof request.body === 'string') {
				try {
					formFields = JSON.parse(request.body) || [{ key: '', value: '' }];
				} catch {
					formFields = [{ key: '', value: '' }];
				}
			} else {
				formFields = [{ key: '', value: '' }];
			}
		}
	}

	function sync() {
		if (request.bodyType === 'form') {
			request.body = JSON.stringify(formFields);
		}
		updateActiveRequest(request);
	}

	function addField() {
		formFields = [...formFields, { key: '', value: '' }];
		sync();
	}

	function removeField(i) {
		formFields = formFields.filter((_, idx) => idx !== i);
		sync();
	}

	async function send() {
		if (!request.url) return;
		
		responseStore.set({ loading: true });
		try {
			let body;
			let headers = { ...request.headers };

			if (request.bodyType === 'raw') {
				body = request.body;
			}

			if (request.bodyType === 'form') {
				const fd = new FormData();
				formFields.forEach((f) => {
					if (f.key) fd.append(f.key, f.value);
				});
				body = fd;
				// Browser will set the correct Content-Type for FormData
				delete headers['Content-Type'];
			}

			const startTime = Date.now();
			const res = await fetch(request.url, {
				method: request.method,
				headers,
				body: ['GET', 'HEAD'].includes(request.method) ? null : body
			});
			const endTime = Date.now();

			const text = await res.text();
			let parsedBody = text;
			try {
				parsedBody = JSON.parse(text);
			} catch (e) {
				// not json
			}

			responseStore.set({
				status: res.status,
				statusText: res.statusText,
				time: endTime - startTime,
				headers: Object.fromEntries(res.headers.entries()),
				body: parsedBody
			});
		} catch (e) {
			responseStore.set({ error: e.message });
		}
	}
</script>

<div class="builder">
	{#if $currentRequestStore}
		<div class="request-header">
			<input 
				class="request-name-input" 
				bind:value={request.name} 
				on:input={sync} 
				placeholder="Request Name"
			/>
		</div>

		<div class="top">
			<select bind:value={request.method} on:change={sync}>
				<option>GET</option>
				<option>POST</option>
				<option>PUT</option>
				<option>PATCH</option>
				<option>DELETE</option>
				<option>HEAD</option>
				<option>OPTIONS</option>
			</select>

			<input 
				class="url" 
				bind:value={request.url} 
				on:input={sync} 
				placeholder="https://api.example.com/v1/resource"
			/>
			
			<button class="send primary" on:click={send}>Send</button>
		</div>

		<div class="tabs">
			<button
				class:active={request.bodyType === 'raw'}
				on:click={() => { request.bodyType = 'raw'; sync(); }}>
				Body (Raw)
			</button>
			<button
				class:active={request.bodyType === 'form'}
				on:click={() => { request.bodyType = 'form'; sync(); }}>
				Body (Form)
			</button>
		</div>

		<div class="body-content">
			{#if request.bodyType === 'raw'}
				<textarea
					rows="10"
					placeholder="Request Body (JSON, text, etc.)"
					bind:value={request.body}
					on:input={sync}>
				</textarea>
			{:else}
				<div class="form">
					{#each formFields as field, i}
						<div class="form-row">
							<input placeholder="Key" bind:value={field.key} on:input={sync} />
							<input placeholder="Value" bind:value={field.value} on:input={sync} />
							<button class="danger" on:click={() => removeField(i)}>✕</button>
						</div>
					{/each}

					<button class="add" on:click={addField}>
						+ Add Field
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">
			<p>Select a request from the sidebar or create a new one.</p>
		</div>
	{/if}
</div>

<style>
	.builder {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		height: 100%;
		overflow-y: auto;
	}

	.request-header {
		margin-bottom: -8px;
	}

	.request-name-input {
		background: none;
		border: none;
		font-size: 18px;
		font-weight: 600;
		padding: 0;
		color: var(--text);
		width: 100%;
	}

	.request-name-input:focus {
		box-shadow: none;
	}

	.top {
		display: flex;
		gap: 8px;
	}

	.url {
		flex: 1;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}

	.tabs {
		margin-top: 8px;
	}

	.body-content {
		flex: 1;
	}

	textarea {
		width: 100%;
		min-height: 200px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		line-height: 1.5;
		padding: 12px;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--muted);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-row {
		display: flex;
		gap: 8px;
	}

	.form-row input {
		flex: 1;
	}

	.add {
		align-self: flex-start;
		margin-top: 4px;
	}
</style>
