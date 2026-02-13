import { writable, get } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

export const isHydrated = writable(false);

const persist = (key, initialValue) => {
	// Start with initialValue, but if we're in the browser, we'll try to load from localStorage
	let data = initialValue;
	
	if (isBrowser) {
		const storedValue = localStorage.getItem(key);
		if (storedValue !== null) {
			try {
				data = JSON.parse(storedValue);
			} catch (e) {
				console.error(`Error parsing localStorage key "${key}":`, e);
			}
		}
	}

	const store = writable(data);

	if (isBrowser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}

	return store;
};

// Signal hydration completion after all stores are initialized
if (isBrowser) {
	setTimeout(() => isHydrated.set(true), 0);
}

const defaultCollections = [
	{
		id: 'col-1',
		name: 'Sample APIs',
		requests: [
			{
				id: 'req-1',
				name: 'Get Post',
				method: 'GET',
				url: 'https://jsonplaceholder.typicode.com/posts/1',
				headers: {},
				body: '',
				bodyType: 'raw'
			},
			{
				id: 'req-2',
				name: 'Create Post',
				method: 'POST',
				url: 'https://jsonplaceholder.typicode.com/posts',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }, null, 2),
				bodyType: 'raw'
			}
		]
	}
];

export const collectionsStore = persist('restflow_collections', defaultCollections);
export const activeCollectionId = persist('restflow_active_col', 'col-1');
export const activeRequestId = persist('restflow_active_req', 'req-1');

export const responseStore = writable(null);

export function updateActiveRequest(update) {
	const colId = get(activeCollectionId);
	const reqId = get(activeRequestId);

	collectionsStore.update((cols) => {
		return cols.map((col) => {
			if (col.id === colId) {
				return {
					...col,
					requests: col.requests.map((req) => {
						if (req.id === reqId) {
							return { ...req, ...update };
						}
						return req;
					})
				};
			}
			return col;
		});
	});
}

export function addCollection(name) {
	const newCol = {
		id: 'col-' + Date.now(),
		name,
		requests: []
	};
	collectionsStore.update((cols) => [...cols, newCol]);
	return newCol;
}

export function addRequest(colId, name = 'New Request') {
	const newReq = {
		id: 'req-' + Date.now(),
		name,
		method: 'GET',
		url: '',
		headers: {},
		body: '',
		bodyType: 'raw'
	};

	collectionsStore.update((cols) => {
		return cols.map((col) => {
			if (col.id === colId) {
				return {
					...col,
					requests: [...col.requests, newReq]
				};
			}
			return col;
		});
	});

	return newReq;
}

export function deleteCollection(id) {
	collectionsStore.update((cols) => cols.filter((c) => c.id !== id));
	if (get(activeCollectionId) === id) {
		activeCollectionId.set(null);
		activeRequestId.set(null);
	}
}

export function renameCollection(id, name) {
	collectionsStore.update((cols) =>
		cols.map((c) => (c.id === id ? { ...c, name } : c))
	);
}

export function deleteRequest(colId, reqId) {
	collectionsStore.update((cols) =>
		cols.map((col) => {
			if (col.id === colId) {
				return {
					...col,
					requests: col.requests.filter((r) => r.id !== reqId)
				};
			}
			return col;
		})
	);
	if (get(activeRequestId) === reqId) {
		activeRequestId.set(null);
	}
}

export function renameRequest(colId, reqId, name) {
	collectionsStore.update((cols) =>
		cols.map((col) => {
			if (col.id === colId) {
				return {
					...col,
					requests: col.requests.map((r) => (r.id === reqId ? { ...r, name } : r))
				};
			}
			return col;
		})
	);
}