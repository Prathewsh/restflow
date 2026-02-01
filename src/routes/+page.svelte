<script>
import Sidebar from '$lib/components/Sidebar.svelte';
import RequestBuilder from '$lib/components/RequestBuilder.svelte';
import ResponseViewer from '$lib/components/ResponseViewer.svelte';
</script>


<div class="app">
<Sidebar />


<div class="main">
<RequestBuilder />
<ResponseViewer />
</div>
</div>


<style>
.app {
display: flex;
height: 100vh;
}
.main {
flex: 1;
display: flex;
flex-direction: column;
}
</style>