<template>
  <ToolShell tool-key="emailPreview">
    <div class="header-actions">
      <button class="btn" @click="loadExample">
        {{ t("tools.emailPreview.loadExample") }}
      </button>
      <button class="btn" @click="openInNewTab">
        {{ t("tools.emailPreview.openInNewTab") }}
      </button>
    </div>

    <div class="tool-layout">
      <div class="left">
        <div class="field">
          <label for="html-in">{{ t("tools.emailPreview.htmlInput") }}</label>
          <textarea
            id="html-in"
            v-model="html"
            :placeholder="t('tools.emailPreview.htmlPlaceholder')"
          />
        </div>

        <div class="card mt-8">
          <div class="card-header">
            <h3>{{ t("tools.emailPreview.variables") }}</h3>
            <button class="btn btn-primary" @click="addVariable">
              {{ t("tools.emailPreview.addVariable") }}
            </button>
          </div>

          <div class="vars-list">
            <div v-for="(v, idx) in variables" :key="v.id" class="var-row">
              <div class="input-group">
                <input
                  :ref="(el: any) => setKeyRef(el, idx)"
                  v-model="v.key"
                  class="input"
                  :placeholder="t('tools.emailPreview.keyPlaceholder')"
                  @input="persist"
                />
                <input
                  :ref="(el: any) => setValueRef(el, idx)"
                  v-model="v.value"
                  class="input"
                  :placeholder="t('tools.emailPreview.valuePlaceholder')"
                  @input="persist"
                />
                <button
                  class="icon-btn"
                  aria-label="Remove"
                  @click="removeVariable(idx)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zm3.46-8.88a1 1 0 0 1 1.41 0L12 11.25l1.13-1.13a1 1 0 1 1 1.41 1.41L13.41 12.7l1.13 1.13a1 1 0 0 1-1.41 1.41L12 14.11l-1.13 1.13a1 1 0 1 1-1.41-1.41l1.13-1.13-1.13-1.13a1 1 0 0 1 0-1.41zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="suggestions">
            <div class="suggestions-header">
              <h4>{{ t("tools.emailPreview.suggestions") }}</h4>
              <p class="helper">
                {{ t("tools.emailPreview.suggestionsHelper") }}
              </p>
            </div>
            <div v-if="suggestedKeys.length" class="suggestion-list">
              <button
                v-for="s in suggestedKeys"
                :key="s"
                class="suggestion-chip"
                :title="t('tools.emailPreview.addThis')"
                @click="addSuggestion(s)"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                <span>{{ s }}</span>
              </button>
            </div>
            <p v-else class="helper">
              {{ t("tools.emailPreview.noSuggestions") }}
            </p>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="top-actions">
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: tab === 'preview' }"
              @click="tab = 'preview'"
            >
              {{ t("tools.emailPreview.tabPreview") }}
            </button>
            <button
              class="tab"
              :class="{ active: tab === 'html' }"
              @click="tab = 'html'"
            >
              {{ t("tools.emailPreview.tabHtml") }}
            </button>
          </div>

          <div class="action-buttons">
            <button class="btn" @click="copyHtml">
              {{ t("tools.emailPreview.copyHtml") }}
            </button>
            <button class="btn" @click="downloadHtml">
              {{ t("tools.emailPreview.downloadHtml") }}
            </button>
            <button class="btn" @click="openAnalyzer">
              {{ t("tools.emailPreview.openAnalyzer") }}
            </button>
          </div>
        </div>

        <div v-if="emailTitle" class="subject-bar">
          <strong>{{ t("tools.emailPreview.subject") }}:</strong>
          <span class="subject-text">{{ emailTitle }}</span>
        </div>

        <div class="preview">
          <div v-if="tab === 'preview'" class="preview-pane">
            <div v-if="!replacedHtml" class="empty-state">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 4a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8Zm0 14a6 6 0 1 1 6-6 6.01 6.01 0 0 1-6 6Zm0-10a1 1 0 0 1 .86.5l3 5a1 1 0 1 1-1.72 1l-2.14-3.57-1.14 1.9A1 1 0 1 1 9.14 12l2-3.33A1 1 0 0 1 12 8Z"
                />
              </svg>
              <p>{{ t("tools.emailPreview.pasteHtmlToPreview") }}</p>
            </div>
            <template v-else>
              <ClientOnly>
                <iframe
                  ref="previewFrame"
                  class="iframe-like"
                  sandbox="allow-same-origin"
                  :srcdoc="replacedHtml"
                />
              </ClientOnly>
            </template>
          </div>

          <div v-else class="code-pane">
            <pre><code>{{ replacedHtml }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { useHead, useRouter } from "nuxt/app";
import ToolShell from "~/components/layout/ToolShell.vue";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();
const router = useRouter();

definePageMeta({
  alias: [
    "/pt-br/email-preview",
    "/en/email-preview",
    "/es/email-preview",
    "/email-preview",
  ],
});

useHead({
  title: computed(() => t("meta.emailPreview.title")),
  meta: [
    {
      name: "description",
      content: computed(() => t("meta.emailPreview.description")),
    },
  ],
});

interface VarItem {
  id: number;
  key: string;
  value: string;
}
const html = ref("");
const variables = ref<VarItem[]>([]);
const tab = ref<"preview" | "html">("preview");
const keyRefs = ref<HTMLInputElement[]>([]);
const valueRefs = ref<HTMLInputElement[]>([]);

function setKeyRef(el: HTMLInputElement | null, idx: number) {
  if (!el) return;
  keyRefs.value[idx] = el;
}
function setValueRef(el: HTMLInputElement | null, idx: number) {
  if (!el) return;
  valueRefs.value[idx] = el;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const replacedHtml = computed(() => {
  let out = html.value || "";
  for (const v of variables.value) {
    if (!v.key) continue;
    const re = new RegExp(escapeRegExp(v.key), "g");
    out = out.replace(re, v.value ?? "");
  }
  return out;
});

const emailTitle = computed(() => {
  const src = replacedHtml.value;
  if (!src) return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(src, "text/html");
    const tEl = doc.querySelector("title");
    const txt = (tEl?.textContent || "").trim();
    if (txt) return txt;
  } catch (err) {
    console.error("Error parsing email title:", err);
  }
  const m = src.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return (m?.[1] || "").trim();
});

function persist() {
  const toSave = variables.value.filter((v) => v.key || v.value);
  localStorage.setItem("emailPreview:variables", JSON.stringify(toSave));
  ensureBlankRow();
}

function ensureBlankRow() {
  const last = variables.value[variables.value.length - 1];
  if (!last || last.key || last.value) {
    variables.value.push({
      id: Date.now() + Math.random(),
      key: "",
      value: "",
    });
  }
}

const patternStyle = computed<"mustache" | "dollar" | "unknown">(() => {
  const keys = variables.value.map((v) => v.key || "");
  if (keys.some((k) => /^\s*{{/.test(k))) return "mustache";
  if (keys.some((k) => /^\s*\$\{/.test(k))) return "dollar";
  if (/{{\s*[A-Za-z_]/.test(html.value)) return "mustache";
  if (/\$\{\s*[A-Za-z_]/.test(html.value)) return "dollar";
  return "unknown";
});

function longestCommonPrefix(arr: string[]) {
  if (!arr.length) return "";
  let prefix = arr[0];
  for (let i = 1; i < arr.length; i++) {
    while (!arr[i].startsWith(prefix) && prefix) prefix = prefix.slice(0, -1);
    if (!prefix) break;
  }
  return prefix;
}
function longestCommonSuffix(arr: string[]) {
  if (!arr.length) return "";
  const rev = arr.map((s) => [...s].reverse().join(""));
  let suff = rev[0];
  for (let i = 1; i < rev.length; i++) {
    while (!rev[i].startsWith(suff) && suff) suff = suff.slice(0, -1);
    if (!suff) break;
  }
  return [...suff].reverse().join("");
}

function inferWrapper() {
  const keys = variables.value.map((v) => v.key).filter(Boolean) as string[];
  if (keys.length < 2) return null;
  const prefix = longestCommonPrefix(keys);
  const suffix = longestCommonSuffix(keys);
  if (!prefix && !suffix) return null;
  // Avoid colon pattern noise
  if (prefix === ":" && suffix === "") return null;
  const innerRe = "([A-Za-z0-9._-]+)";
  const re = new RegExp(
    "^" + escapeRegExp(prefix) + innerRe + escapeRegExp(suffix) + "$",
  );
  const matches = keys.map((k) => re.exec(k));
  if (matches.some((m) => !m || !m[1])) return null;
  const uniques = new Set(matches.map((m) => m![1]));
  if (uniques.size < 2) return null;
  return { prefix, suffix };
}

const suggestedKeys = computed(() => {
  const existing = new Set(
    variables.value.map((v) => v.key).filter(Boolean) as string[],
  );
  const out = new Set<string>();
  const text = html.value || "";

  const inferred = inferWrapper();
  if (inferred) {
    const re = new RegExp(
      escapeRegExp(inferred.prefix) +
        "([A-Za-z0-9._-]+)" +
        escapeRegExp(inferred.suffix),
      "g",
    );
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const full = m[0];
      if (!existing.has(full)) out.add(full);
    }
  }

  if (patternStyle.value === "mustache" || patternStyle.value === "unknown") {
    const re = /{{\s*([A-Za-z_][\w.-]*)\s*}}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const full = m[0];
      if (!existing.has(full)) out.add(full);
    }
  }
  if (patternStyle.value === "dollar" || patternStyle.value === "unknown") {
    const re3 = /\$\{\s*([A-Za-z_][\w.-]*)\s*\}/g;
    let m3: RegExpExecArray | null;
    while ((m3 = re3.exec(text))) {
      const full = m3[0];
      if (!existing.has(full)) out.add(full);
    }
  }
  return Array.from(out).slice(0, 30);
});

function addSuggestion(key: string) {
  const item = { id: Date.now() + Math.random(), key, value: "" };
  const last = variables.value[variables.value.length - 1];
  const hasTrailingBlank = last && !last.key && !last.value;
  let insertIndex = variables.value.length;
  if (hasTrailingBlank) insertIndex = variables.value.length - 1;
  variables.value.splice(insertIndex, 0, item);
  persist();
  nextTick(() => {
    const focusIndex = insertIndex;
    const el = valueRefs.value[focusIndex];
    el?.focus();
  });
}

function addVariable() {
  variables.value.push({ id: Date.now() + Math.random(), key: "", value: "" });
  nextTick(() => {
    const el = keyRefs.value[variables.value.length - 1];
    el?.focus();
  });
}

function removeVariable(idx: number) {
  variables.value.splice(idx, 1);
  persist();
  nextTick(() => {
    const last = keyRefs.value[variables.value.length - 1];
    last?.focus();
  });
}

function copyHtml() {
  navigator.clipboard.writeText(replacedHtml.value);
}

function sanitizeFileName(name: string) {
  return name
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function downloadHtml() {
  const blob = new Blob([replacedHtml.value], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const fallback = t("tools.emailPreview.untitled");
  const name = sanitizeFileName(emailTitle.value || fallback) || fallback;
  a.download = `${name}.html`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

function openInNewTab() {
  const blob = new Blob([replacedHtml.value], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openAnalyzer() {
  localStorage.setItem("emailAnalyzer:input", replacedHtml.value);
  router.push("/email-analyzer");
}

function loadExample() {
  html.value = EXAMPLE_HTML;
  variables.value = [
    { id: 1, key: ":name", value: "João Silva" },
    { id: 2, key: ":email", value: "joao@exemplo.com" },
    { id: 3, key: ":link", value: "https://example.com/reset?t=abc123" },
    { id: 4, key: ":primaryColor", value: "orange" },
  ];
  ensureBlankRow();
  persist();
}

onMounted(() => {
  try {
    const raw = localStorage.getItem("emailPreview:variables");
    if (raw) {
      const saved = JSON.parse(raw) as Omit<VarItem, "id">[];
      variables.value = saved.map((v, i) => ({ id: Date.now() + i, ...v }));
    }
  } catch (err) {
    console.error("Error loading saved variables:", err);
  }
  ensureBlankRow();
});

const EXAMPLE_HTML = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Recuperação de Senha</title>
<style>
  body { background:#f4f4f4; margin:0; padding:24px; -webkit-text-size-adjust:100%; text-size-adjust:100%; }
  .mail { max-width:640px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb; }
  .header { padding:24px; border-bottom:1px solid #eee; }
  .brand { font:600 18px/1.2 Arial, Helvetica, sans-serif; color:#111827; }
  .content { padding:24px; font:400 16px/1.6 Arial, Helvetica, sans-serif; color:#111827; }
  .btn { display:inline-block; padding:12px 18px; border-radius:8px; color:#fff; text-decoration:none; background::primaryColor; }
  .muted { color:#6b7280; font-size:14px; }
  .footer { padding:16px 24px 24px; color:#6b7280; font:400 13px/1.4 Arial, Helvetica, sans-serif; }
</style>
</head>
<body>
  <div class="mail">
    <div class="header">
      <div class="brand">SuperTool</div>
    </div>
    <div class="content">
      <h2 style="margin:0 0 12px 0; font:700 24px/1.2 Arial, Helvetica, sans-serif;">Recuperação de Senha</h2>
      <p>Olá, :name!</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta. Para criar uma nova senha, clique no botão abaixo.</p>
      <p style="margin:20px 0;"><a class="btn" href=":link">Redefinir Senha</a></p>
      <p class="muted">Se o botão não funcionar, copie e cole este link no navegador:<br/><a href=":link">:link</a></p>
      <p>Em caso de dúvidas, fale com a gente pelo e‑mail <strong>:email</strong>.</p>
      <p>Abraços,<br/>Equipe SuperTool</p>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} SuperTool</div>
  </div>
</body></html>`;
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
}

.tool-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
}
@media (max-width: 900px) {
  .tool-layout {
    grid-template-columns: 1fr;
  }
}

.left .field {
  display: grid;
  gap: 8px;
}
textarea {
  width: 100%;
  min-height: 220px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.card {
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 12px;
  padding: 16px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.vars-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.var-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  align-items: center;
}
.input {
  width: 100%;
  height: 40px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 8px;
  padding: 0 10px;
}
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-btn:hover {
  background: var(--hover);
}

.suggestions {
  margin-top: 16px;
}
.suggestions-header h4 {
  margin: 0 0 4px 0;
}
.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.suggestion-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 999px;
  padding: 6px 10px;
  cursor: pointer;
}
.suggestion-chip:hover {
  background: var(--hover);
}

.right {
  display: flex;
  flex-direction: column;
}
.top-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.tabs {
  display: flex;
  gap: 8px;
}
.tab {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
}
.tab.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.subject-bar {
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 12px;
  padding: 8px 12px;
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.subject-text {
  color: var(--text);
}

.preview {
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 12px;
  min-height: 300px;
}
.preview-pane {
  padding: 16px;
}
.code-pane {
  padding: 16px;
  overflow: auto;
}
.code-pane pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.empty-state {
  color: hsl(var(--muted-foreground));
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}
.iframe-like {
  width: 100%;
  min-height: 400px;
  border: none;
  border-radius: 8px;
  background: white;
}
.iframe-like :deep(html),
.iframe-like :deep(body) {
  background: transparent;
}

.btn {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}
.btn:hover {
  background: var(--hover);
}
.btn.btn-primary {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
