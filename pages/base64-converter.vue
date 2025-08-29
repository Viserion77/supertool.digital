<template>
  <div class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <NuxtLink to="/">Início</NuxtLink>
      <span>›</span>
      <NuxtLink to="/conversores">Conversores</NuxtLink>
      <span>›</span>
      <span>Base64</span>
    </nav>

    <header class="mb-12">
      <h1>Conversor Base64</h1>
      <p class="helper">Codifique e decodifique texto em Base64 de forma rápida e segura.</p>
      <div class="badges mt-8">
        <UiBadge variant="neutral">Gratuito</UiBadge>
        <UiBadge variant="success">Sem Cadastro</UiBadge>
        <UiBadge variant="warning">Seguro</UiBadge>
      </div>
    </header>

    <div class="sidebar-grid">
      <UiCard>
        <template #head>
          <strong>{{ decode ? 'Decodificar de Base64' : 'Codificar para Base64' }}</strong>
        </template>
        <template #headActions>
          <label class="helper inline-flex">
            <input type="checkbox" v-model="decode" />
            Decodificar
          </label>
        </template>

        <div class="field mt-12">
          <label :for="inputId">{{ decode ? 'Texto para decodificar' : 'Texto para codificar' }}</label>
          <textarea :id="inputId" v-model="input" placeholder="Digite o texto que deseja converter para Base64..."></textarea>
          <div class="helper">Caracteres: {{ count }}</div>
        </div>

        <template #actions>
          <UiButton variant="primary" @click="convert">{{ decode ? 'Decodificar' : 'Codificar' }}</UiButton>
          <UiButton @click="clearAll">Limpar Tudo</UiButton>
          <UiButton @click="copy">Copiar</UiButton>
          <UiButton @click="download">Baixar .txt</UiButton>
        </template>

        <div class="field mt-12">
          <label for="b64-out">Resultado</label>
          <textarea id="b64-out" v-model="output" readonly></textarea>
        </div>

        <p v-if="error" class="error mt-8" aria-live="polite">{{ error }}</p>
      </UiCard>

      <div class="stack">
        <UiCard title="O que é Base64?">
          <p class="helper">Base64 é um sistema de codificação que converte dados binários em texto ASCII. É amplamente usado para transmitir dados em sistemas que lidam apenas com texto.</p>
          <h4 class="mt-12">Usos comuns</h4>
          <ul class="helper">
            <li>Incorporar imagens em HTML/CSS</li>
            <li>Transmitir dados via e-mail</li>
            <li>Armazenar dados binários em JSON</li>
            <li>APIs e web services</li>
          </ul>
        </UiCard>

        <UiCard title="Exemplos">
          <div class="mt-8">
            <div class="helper">Texto:</div>
            <div class="code">Olá, mundo!</div>
          </div>
          <div class="mt-8">
            <div class="helper">Base64:</div>
            <div class="code">T2zDoSwgbXVuZG8h</div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ alias: ['/pt-br/base64-converter','/en/base64-converter','/es/base64-converter'] })
import { computed, ref } from 'vue'
import { useHead } from 'nuxt/app'
import UiButton from '~/components/UI/Button.vue'
import UiBadge from '~/components/UI/Badge.vue'
import UiCard from '~/components/UI/Card.vue'

useHead({
  title: 'Conversor Base64 – Codificar e decodificar online',
  meta: [
    { name: 'description', content: 'Codifique e decodifique Base64 online. Rápido, seguro e sem cadastro.' }
  ],
  htmlAttrs: { lang: 'pt-BR' },
  link: [ { rel: 'canonical', href: 'https://www.supertool.digital/base64-converter' } ]
})

const input = ref('')
const output = ref('')
const error = ref('')
const decode = ref(false)
const inputId = 'b64-in'
const count = computed(() => input.value.length)

function copy(){ navigator.clipboard.writeText(output.value) }
function clearAll(){ input.value=''; output.value=''; error.value='' }
function download(){
  const blob = new Blob([output.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: 'base64.txt' })
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function encodeUnicode(str: string){
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}
function decodeUnicode(b64: string){
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

function convert(){
  error.value = ''
  try {
    output.value = decode.value ? decodeUnicode(input.value) : encodeUnicode(input.value)
  } catch (e) {
    error.value = 'Falha na conversão. Verifique seu texto.'
    output.value = ''
  }
}
</script>
