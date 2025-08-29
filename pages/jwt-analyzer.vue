<template>
  <div class="container">
    <header class="mb-12">
      <h1>JWT Token Analyzer</h1>
      <p class="helper">Analise um JSON Web Token sem enviar seus dados. Decodifica Header e Payload localmente.</p>
    </header>

    <div class="tool-layout">
      <div class="field">
        <label for="jwt-in">JWT</label>
        <textarea id="jwt-in" v-model="token" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkFkYSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2..." />
        <span class="helper">Cole um token no formato header.payload.signature</span>
      </div>
      <div class="field">
        <label for="out">Resultado</label>
        <textarea id="out" :value="pretty" readonly />
      </div>
    </div>

    <div class="actions mt-12">
      <button class="btn btn-primary" @click="analyze">Analisar</button>
      <button class="btn" @click="copy">Copiar</button>
      <button class="btn" @click="clearAll">Limpar</button>
    </div>

    <p v-if="error" class="error mt-8" aria-live="polite">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ alias: ['/pt-br/jwt-analyzer','/en/jwt-analyzer','/es/jwt-analyzer'] })
import { ref } from 'vue'
import { useHead } from 'nuxt/app'

useHead({ title: 'JWT Token Analyzer – Decode JWT locally', meta: [
  { name: 'description', content: 'Decode and inspect JWT header and payload locally in your browser. Safe and fast.' }
]})

const token = ref('')
const pretty = ref('')
const error = ref('')

function b64urlToStr(input: string){
  try {
    const pad = (s: string) => s + '==='.slice((s.length + 3) % 4)
    const b64 = pad(input.replace(/-/g,'+').replace(/_/g,'/'))
    const bin = atob(b64)
    const bytes = new Uint8Array([...bin].map(c => c.charCodeAt(0)))
    return new TextDecoder().decode(bytes)
  } catch { throw new Error('Base64 inválido') }
}

function analyze(){
  error.value = ''
  pretty.value = ''
  const parts = token.value.split('.')
  if (parts.length < 2){ error.value = 'Token inválido: esperado header.payload[.signature]'; return }
  try {
    const header = JSON.parse(b64urlToStr(parts[0]))
    const payload = JSON.parse(b64urlToStr(parts[1]))
    const result = { header, payload, hasSignature: parts.length === 3 }
    pretty.value = JSON.stringify(result, null, 2)
  } catch (e){ error.value = 'Falha ao decodificar. Verifique seu token.' }
}

function copy(){ navigator.clipboard.writeText(pretty.value) }
function clearAll(){ token.value=''; pretty.value=''; error.value='' }
</script>
