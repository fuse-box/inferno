const { FuseBox, TypeScriptHelpers, ReplacePlugin } = require("fsbx");
const fuse = FuseBox.init({
    src: "packages",
    outFile: "bundle.inferno.js",
    plugins: [
        ReplacePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
    ],
    alias: { // this can be automatically assigned
        "inferno-compat": "~/packages/inferno-compat",
        "inferno-component": "~/packages/inferno-component/dist-es",
        "inferno-create-class": "~/packages/inferno-create-class/dist-es",
        "inferno-create-element": "~/packages/inferno-create-element/dist-es",
        "inferno-shared": "~/packages/inferno-shared/dist-es",
        "inferno-hyperscript": "~/packages/inferno-hyperscript/dist-es",
        "inferno-mobx": "~/packages/inferno-mobx/dist-es",
        "inferno-redux": "~/packages/inferno-redux/dist-es",
        "inferno-router": "~/packages/inferno-router/dist-es",
        "inferno-server": "~/packages/inferno-server/dist-es",
        "inferno": "~/packages/inferno/dist-es"
    }
});

fuse.bundle(`packages/inferno/src/index.ts`).then(bundle => {
    return fuse.rollup(bundle.content, {
        entry: `packages/inferno/src/index.js`,
        outFile: "fusebox.dope.rollup.js"
    });
})