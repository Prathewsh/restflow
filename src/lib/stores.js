import { writable } from 'svelte/store';


export const requestStore = writable({
method: 'GET',
url: 'https://jsonplaceholder.typicode.com/posts/1',
headers: {},
body: ''
});


export const responseStore = writable(null);