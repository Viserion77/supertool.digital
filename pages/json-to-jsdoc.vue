<template>
  <div class="container">
    <header class="mb-12">
      <h1>JSON to JSDoc Converter</h1>
      <p class="helper">Convert JSON into JSDoc comments. Free, online, no signup.</p>
    </header>

    <div class="tool-layout">
      <div class="field">
        <label for="json-in">JSON input</label>
        <textarea id="json-in" v-model="input" placeholder='{"name":"Ada","age":36,"skills":["math","logic"]}' aria-describedby="json-help"></textarea>
        <span id="json-help" class="helper">Paste a valid JSON object. We do not execute code.</span>
      </div>
      <div class="field">
        <label for="jsdoc-out">JSDoc output</label>
        <textarea id="jsdoc-out" v-model="output" readonly></textarea>
      </div>
    </div>

    <div class="actions mt-12">
      <button class="btn btn-primary" @click="convert">Convert</button>
      <button class="btn" @click="copy">Copy</button>
      <button class="btn" @click="clearAll">Clear</button>
      <button class="btn" @click="download('txt')">Download .txt</button>
      <button class="btn" @click="download('md')">Download .md</button>
    </div>

    <p v-if="error" class="error mt-8" aria-live="polite">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ alias: ['/pt-br/json-to-jsdoc','/en/json-to-jsdoc','/es/json-to-jsdoc'] })
import { ref } from 'vue'
import { useHead } from 'nuxt/app'

useHead({
  title: 'JSON to JSDoc Converter – Free Online Tool',
  meta: [
    { name: 'description', content: 'Easily convert JSON into JSDoc comments. Free, online, no signup required. Improve your documentation instantly with SuperTool.' },
    { name: 'keywords', content: 'json to jsdoc converter, generate jsdoc from json, json documentation tool, free jsdoc generator' },
  ],
  htmlAttrs: { lang: 'en' },
  link: [ { rel: 'canonical', href: 'https://www.supertool.digital/json-to-jsdoc' } ],
})

const input = ref('')
const output = ref('')
const error = ref('')

function copy(){ navigator.clipboard.writeText(output.value) }
function clearAll(){ input.value=''; output.value=''; error.value='' }

function download(ext: 'txt'|'md'){
  const blob = new Blob([output.value], { type: ext==='md' ? 'text/markdown' : 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: `jsdoc.${ext}` })
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function toType(v: any): string {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

function convert(){
  error.value = ''
  output.value = ''
  let data: any
  try { data = JSON.parse(input.value) }
  catch { error.value = 'Invalid JSON. Please provide a valid JSON object.'; return }

  const seen = new Map<string,string>()
  let docs = ''

  const typedefFor = (obj: Record<string, any>, name: string) => {
    docs += `/**\n * @typedef {Object} ${name}\n`
    for (const [k, v] of Object.entries(obj)) {
      let t = toType(v)
      if (t === 'array') {
        if (v.length === 0) t = 'Array<any>'
        else {
          const itemTypes = new Set<string>()
          for (const item of v){
            const it = toType(item)
            if (it === 'object' && item) {
              const key = JSON.stringify(item)
              let tn = seen.get(key)
              if (!tn){ tn = `Type${seen.size+1}`; seen.set(key, tn); typedefFor(item, tn) }
              itemTypes.add(tn)
            } else {
              itemTypes.add(it)
            }
          }
          t = `Array<${Array.from(itemTypes).join(' | ')}>`
        }
      } else if (t === 'object' && v) {
        const key = JSON.stringify(v)
        let tn = seen.get(key)
        if (!tn){ tn = `Type${seen.size+1}`; seen.set(key, tn); typedefFor(v, tn) }
        t = tn
      }
      docs += ` * @property {${t}} ${k}\n`
    }
    docs += ` */\n`
  }

  const rootName = 'GeneratedType'
  typedefFor(data, rootName)
  output.value = docs.trim()
}
</script>
