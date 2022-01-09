function encodeBase64(str) {
  let buf = Buffer.from(str, 'utf8');
  return buf.toString('base64');
}

export async function svelte([code]) {
  const id = `virtual:inline-svelte:${encodeBase64(code)}.svelte`
  return import(id);
}

export default function vitePluginSvelteInlineComponents() {
  return {
    name: 'svelte-inline-components',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith('virtual:inline-svelte')) {
        return id
      }
    },

    load(id) {
      if (id.startsWith('virtual:inline-svelte')) {
        let base64ComponentSource = id.split(/virtual:inline-svelte:/)[1].slice(0, -7);
        let buf = Buffer.from(base64ComponentSource, 'base64');
        return buf.toString('utf8');
      }
    },
  }
}