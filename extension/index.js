const socketio = io.connect("http://127.0.0.1:9019");
document.addEventListener("__LOAD_CAPTIONS", (data) => {
    if (data.detail) {
        socketio.emit("LOAD", data.detail)
    }
})
document.addEventListener("__UNLOAD_CAPTIONS", () => {
    socketio.emit("UNLOAD")
})
document.addEventListener("__RANGE_ENTER", (data) => {
    console.log(data)
    if (data.detail) {
        socketio.emit("RANGE_ENTER", data.detail)
    }
})

const genLoadHookScript = (name) => `
document.dispatchEvent(new CustomEvent("__LOAD_CAPTIONS", {detail: ${name}}));
`

const genUnLoadHookScript = () => `
document.dispatchEvent(new CustomEvent("__UNLOAD_CAPTIONS"));
`

const genRangeEnterHookScript = (name) => `
document.dispatchEvent(new CustomEvent("__RANGE_ENTER", {detail: ${name}}));
`

new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.tagName === "SCRIPT") {
                if (node.src.endsWith("captions.js")) {
                    const url = node.src
                    node.remove();
                    (async () => {
                        let captions_js = await fetch(url).then(res => res.text())
                        const currentPlayerTrackVar = captions_js.match(/(this.\w+)&&\(this.\w+.clear\(\)/)[1]

                        let m = captions_js.match(/\w+\.\w+\.load=function\(\){/)
                        let pos = m[0].length + m.index;
                        captions_js = captions_js.slice(0, pos) + genLoadHookScript(currentPlayerTrackVar) + captions_js.slice(pos)

                        m = captions_js.match(/\w+\.\w+\.unload=function\(\){/)
                        pos = m[0].length + m.index;
                        captions_js = captions_js.slice(0, pos) + genUnLoadHookScript() + captions_js.slice(pos)
                        
                        m = captions_js.match(/\w+\.\w+\.onCueRangeEnter=function\((\w+)\){/)
                            console.log(m)
                            pos = m[0].length + m.index;
                            captions_js = captions_js.slice(0, pos) + genRangeEnterHookScript(m[1]) + captions_js.slice(pos)

                        const script = document.createElement("script");
                        script.innerHTML = captions_js;
                        document.head.appendChild(script);
                    })()
                }
            }
        }
    }
}).observe(document, {
    childList: true,
    subtree: true,
});