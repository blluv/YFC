<script>
	let captions = ["안녕하세요오"];
	const { ipcRenderer } = require('electron');

	ipcRenderer.on("LOAD", (event, payload) => {
		console.log(payload)
		// captions = payload.events.map(e=>e.segs.map(e=>e.utf8).join(" "))
	})
	ipcRenderer.on("UNLOAD", (event, payload) => {
		captions = []
	})
	ipcRenderer.on("RANGE_ENTER", (event, payload) => {
		captions = [payload.j[0].text]
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
