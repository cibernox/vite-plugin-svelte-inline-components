async function hash(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');  
}

const CODE_HASH_MAPPING = {};

export async function svelte([code]) {
  const id = `virtual:inline-svelte:${await hash(code)}.svelte`
  CODE_HASH_MAPPING[id] = code;
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
      if (id.startsWith('virtual:inline-svelte') && CODE_HASH_MAPPING.hasOwnProperty(id)) {
        return CODE_HASH_MAPPING[id];
      }
    },
  }
}