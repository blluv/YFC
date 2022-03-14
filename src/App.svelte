<script>
	let captions = [];
	const { ipcRenderer } = require('electron');

	ipcRenderer.on("LOAD", (event, payload) => {
	})
	ipcRenderer.on("UNLOAD", (event, payload) => {
		captions = []
	})
	ipcRenderer.on("RANGE_ENTER", (event, payload) => {
		captions = [payload.text ? payload.text : payload.j.map(e=>e.text).join(" ")]
	})
</script>

<main>
	<div class="caption_area">
		{#each captions as caption}
			<p>{caption}</p>
		{/each}
	</div>
</main>

<style>
	.caption_area {
		user-select: none;
		display: inline-block;
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 10px;
		padding-left: 10px;
		overflow: hidden;
	}

	p {
		margin-top: 1em;
		color: white;
		font-size: 1em;
		font-weight: bold;
	}
</style>
