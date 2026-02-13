<script>
	import { 
		collectionsStore, 
		activeCollectionId, 
		activeRequestId, 
		addCollection, 
		addRequest,
		deleteCollection,
		renameCollection,
		deleteRequest,
		renameRequest
	} from '../stores';

	function selectRequest(colId, reqId) {
		activeCollectionId.set(colId);
		activeRequestId.set(reqId);
	}

	function handleAddCollection() {
		const name = prompt('Collection Name:');
		if (name) {
			const col = addCollection(name);
			activeCollectionId.set(col.id);
		}
	}

	function handleAddRequest(colId) {
		const name = prompt('Request Name:');
		if (name) {
			const req = addRequest(colId, name);
			activeCollectionId.set(colId);
			activeRequestId.set(req.id);
		}
	}

	function handleDeleteCollection(id, name) {
		if (confirm(`Delete collection "${name}" and all its requests?`)) {
			deleteCollection(id);
		}
	}

	function handleRenameCollection(id, currentName) {
		const name = prompt('Rename Collection:', currentName);
		if (name && name !== currentName) {
			renameCollection(id, name);
		}
	}

	function handleDeleteRequest(colId, reqId, name) {
		if (confirm(`Delete request "${name}"?`)) {
			deleteRequest(colId, reqId);
		}
	}

	function handleRenameRequest(colId, reqId, currentName) {
		const name = prompt('Rename Request:', currentName);
		if (name && name !== currentName) {
			renameRequest(colId, reqId, name);
		}
	}
</script>

<div class="sidebar">
	<div class="header">
		<img src="/assets/restflow_logo.png" alt="RestFlow" class="logo-img" />
	</div>

	<div class="section">
		<div class="section-header">
			<h3>Collections</h3>
			<button class="icon-btn" on:click={handleAddCollection} title="Add Collection">+</button>
		</div>

		<div class="collections-list">
			{#each $collectionsStore as col}
				<div class="collection-group">
					<div 
						class="collection-item" 
						class:active={$activeCollectionId === col.id && !$activeRequestId}
					>
						<span 
							class="col-name" 
							on:dblclick={() => handleRenameCollection(col.id, col.name)}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleRenameCollection(col.id, col.name)}
						>
							{col.name}
						</span>
						<div class="actions">
							<button class="action-btn" on:click|stopPropagation={() => handleRenameCollection(col.id, col.name)} title="Rename">✎</button>
							<button class="action-btn" on:click|stopPropagation={() => handleDeleteCollection(col.id, col.name)} title="Delete">✕</button>
							<button class="action-btn add-btn" on:click|stopPropagation={() => handleAddRequest(col.id)} title="Add Request">+</button>
						</div>
					</div>

					<div class="requests-list">
						{#each col.requests as req}
							<div class="request-item-wrapper" class:active={$activeRequestId === req.id}>
								<button
									class="request-item-main"
									on:click={() => selectRequest(col.id, req.id)}
									type="button"
								>
									<span class="method {req.method.toLowerCase()}">{req.method}</span>
									<span 
										class="req-name" 
										on:dblclick|stopPropagation={() => handleRenameRequest(col.id, req.id, req.name)}
									>
										{req.name || 'Untitled'}
									</span>
								</button>
								<div class="req-actions">
									<button class="action-btn" on:click|stopPropagation={() => handleRenameRequest(col.id, req.id, req.name)} title="Rename">✎</button>
									<button class="action-btn danger" on:click|stopPropagation={() => handleDeleteRequest(col.id, req.id, req.name)} title="Delete">✕</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.sidebar {
		width: 260px;
		background: var(--panel);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.header {
		padding: 16px 20px;
		border-bottom: 1px solid var(--border);
	}

	.logo-img {
		height: 24px;
		width: auto;
		display: block;
	}

	.section {
		flex: 1;
		overflow-y: auto;
		padding: 12px 8px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 8px 8px 8px;
	}

	h3 {
		margin: 0;
		font-size: 11px;
		font-weight: 600;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.icon-btn {
		background: none;
		border: none;
		color: var(--muted);
		padding: 2px 6px;
		font-size: 16px;
		line-height: 1;
		cursor: pointer;
	}

	.icon-btn:hover {
		color: var(--text);
		background: var(--highlight-soft);
		border-radius: 4px;
	}

	.collections-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.collection-group {
		display: flex;
		flex-direction: column;
	}

	.collection-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
		color: var(--text);
		cursor: default;
	}

	.col-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		cursor: pointer;
	}

	.actions, .req-actions {
		display: flex;
		gap: 4px;
		opacity: 0;
		transition: opacity 0.1s;
	}

	.collection-item:hover .actions,
	.request-item-wrapper:hover .req-actions {
		opacity: 1;
	}

	.action-btn {
		background: none;
		border: none;
		color: var(--muted);
		padding: 0 4px;
		font-size: 12px;
		cursor: pointer;
	}

	.action-btn:hover {
		color: var(--text);
	}

	.action-btn.danger:hover {
		color: var(--danger);
	}

	.action-btn.add-btn {
		font-size: 16px;
		font-weight: bold;
	}

	.requests-list {
		padding-left: 12px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-top: 2px;
	}

	.request-item-wrapper {
		display: flex;
		align-items: center;
		border-radius: 6px;
		transition: all 0.12s ease;
		position: relative;
	}

	.request-item-wrapper:hover {
		background: var(--highlight-soft);
	}

	.request-item-wrapper.active {
		background: var(--highlight);
	}

	.request-item-main {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		flex: 1;
		background: none;
		border: none;
		color: var(--muted);
		font-size: 13px;
		text-align: left;
		cursor: pointer;
		min-width: 0;
	}

	.request-item-wrapper.active .request-item-main {
		color: var(--text);
	}

	.request-item-wrapper:hover .request-item-main {
		color: var(--text);
	}

	.req-actions {
		padding-right: 8px;
	}

	.method {
		font-size: 9px;
		font-weight: 700;
		width: 32px;
		text-align: left;
		flex-shrink: 0;
	}

	.method.get { color: #22c55e; }
	.method.post { color: #eab308; }
	.method.put { color: #3b82f6; }
	.method.patch { color: #a855f7; }
	.method.delete { color: #ef4444; }

	.req-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
	}
</style>
