<template>
  <ToolShell tool-key="emailAnalyzer">
    <div class="tool-layout">
      <div class="left">
        <div class="field">
          <div class="field-header">
            <label for="html-in">{{
              t("tools.emailAnalyzer.htmlInput")
            }}</label>
            <input
              ref="fileInput"
              type="file"
              accept=".html,.htm,.eml,.txt"
              style="display: none"
              @change="handleFileUpload"
            />
            <button
              type="button"
              class="upload-btn"
              @click="$refs.fileInput.click()"
            >
              📁 Upload
            </button>
          </div>
          <textarea
            id="html-in"
            v-model="html"
            :placeholder="t('tools.emailAnalyzer.placeholder')"
            @input="analyze"
          />
        </div>
      </div>

      <div class="right">
        <div class="controls">
          <UiSelect
            v-model="emailType"
            :options="typeOptions"
            :label="t('tools.emailAnalyzer.emailType')"
          />
        </div>
        <div class="summary">
          <div class="summary-item">
            <span class="count">{{ problems.length }}</span>
            <span>{{ t("tools.emailAnalyzer.problems") }}</span>
          </div>
          <div v-if="criticalCount > 0" class="summary-item critical">
            <span class="count">{{ criticalCount }}</span>
            <span>{{ t("tools.emailAnalyzer.critical") }}</span>
          </div>
        </div>

        <div class="results">
          <section class="group">
            <header>
              <h3>{{ t("tools.emailAnalyzer.generalRules") }}</h3>
            </header>
            <ul class="issues">
              <li
                class="issue"
                :class="{ ok: exclamationsOk, bad: !exclamationsOk }"
                role="button"
                tabindex="0"
                :aria-expanded="open.exclamations"
                @click="open.exclamations = !open.exclamations"
                @keydown.enter.prevent="open.exclamations = !open.exclamations"
                @keydown.space.prevent="open.exclamations = !open.exclamations"
              >
                <div class="status">
                  <svg
                    v-if="exclamationsOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.tooManyExclamations") }}
                    <span class="badge spam">spam</span>
                  </div>
                  <div class="helper">
                    {{
                      t("tools.emailAnalyzer.tooManyExclamationsHelp", {
                        max: maxExclamations,
                      })
                    }}
                  </div>
                  <div v-if="open.exclamations" class="details">
                    {{
                      t("tools.emailAnalyzer.tooManyExclamationsDetails", {
                        max: maxExclamations,
                        count: exclamationsCount,
                      })
                    }}
                    <div class="example">
                      <div class="example-title">
                        {{ t("tools.emailAnalyzer.validation") }}
                      </div>
                      <p class="desc">
                        {{ t("tools.emailAnalyzer.exclamationsValidation") }}
                      </p>
                      <div class="ex-row">
                        <div class="good">
                          <strong
                            >✓
                            {{ t("tools.emailAnalyzer.goodExample") }}</strong
                          >
                          <pre><code>{{ t('tools.emailAnalyzer.goodExclamations') }}</code></pre>
                        </div>
                        <div class="bad">
                          <strong
                            >✗ {{ t("tools.emailAnalyzer.badExample") }}</strong
                          >
                          <pre><code>{{ t('tools.emailAnalyzer.badExclamations') }}</code></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                class="issue"
                :class="{ ok: altsOk, bad: !altsOk }"
                role="button"
                tabindex="0"
                :aria-expanded="open.alts"
                @click="open.alts = !open.alts"
                @keydown.enter.prevent="open.alts = !open.alts"
                @keydown.space.prevent="open.alts = !open.alts"
              >
                <div class="status">
                  <svg
                    v-if="altsOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.imagesAlt") }}
                    <span class="badge bounce">bounce</span>
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.imagesAltHelp") }}
                  </div>
                  <div v-if="open.alts" class="details">
                    {{
                      t("tools.emailAnalyzer.imagesAltDetails", {
                        count: imgsWithoutAlt,
                      })
                    }}
                    <div class="example">
                      <div class="example-title">
                        {{ t("tools.emailAnalyzer.validation") }}
                      </div>
                      <p class="desc">
                        {{ t("tools.emailAnalyzer.altsValidation") }}
                      </p>
                      <div class="ex-row">
                        <div class="good">
                          <strong
                            >✓
                            {{ t("tools.emailAnalyzer.goodExample") }}</strong
                          >
                          <pre><code>&lt;img src="logo.png" alt="{{ t('tools.emailAnalyzer.companyLogo') }}" /&gt;</code></pre>
                        </div>
                        <div class="bad">
                          <strong
                            >✗ {{ t("tools.emailAnalyzer.badExample") }}</strong
                          >
                          <pre><code>&lt;img src="logo.png" /&gt;</code></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li
                class="issue"
                :class="{ ok: spamWordsOk, bad: !spamWordsOk }"
                role="button"
                tabindex="0"
                :aria-expanded="open.spamWords"
                @click="open.spamWords = !open.spamWords"
                @keydown.enter.prevent="open.spamWords = !open.spamWords"
                @keydown.space.prevent="open.spamWords = !open.spamWords"
              >
                <div class="status">
                  <svg
                    v-if="spamWordsOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.spamWordsDetected") }}
                    <span class="badge spam">spam</span>
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.spamWordsHelp") }}
                  </div>
                  <div v-if="open.spamWords" class="details">
                    {{
                      t("tools.emailAnalyzer.spamWordsDetails", {
                        words:
                          foundSpamWords.join(", ") ||
                          t("tools.emailAnalyzer.none"),
                      })
                    }}
                  </div>
                </div>
              </li>
              <li
                class="issue"
                :class="{ ok: capsLockOk, bad: !capsLockOk }"
                role="button"
                tabindex="0"
                :aria-expanded="open.capsLock"
                @click="open.capsLock = !open.capsLock"
                @keydown.enter.prevent="open.capsLock = !open.capsLock"
                @keydown.space.prevent="open.capsLock = !open.capsLock"
              >
                <div class="status">
                  <svg
                    v-if="capsLockOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.excessiveCapsLock") }}
                    <span class="badge spam">spam</span>
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.excessiveCapsLockHelp") }}
                  </div>
                  <div v-if="open.capsLock" class="details">
                    {{
                      t("tools.emailAnalyzer.excessiveCapsLockDetails", {
                        percentage: capsLockPercentage,
                      })
                    }}
                  </div>
                </div>
              </li>
              <li
                class="issue"
                :class="{ ok: emailWidthOk, bad: !emailWidthOk }"
                role="button"
                tabindex="0"
                :aria-expanded="open.emailWidth"
                @click="open.emailWidth = !open.emailWidth"
                @keydown.enter.prevent="open.emailWidth = !open.emailWidth"
                @keydown.space.prevent="open.emailWidth = !open.emailWidth"
              >
                <div class="status">
                  <svg
                    v-if="emailWidthOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.emailTooWide") }}
                    <span class="badge bounce">mobile</span>
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.emailTooWideHelp") }}
                  </div>
                  <div v-if="open.emailWidth" class="details">
                    {{
                      t("tools.emailAnalyzer.emailTooWideDetails", {
                        width: emailWidth,
                      })
                    }}
                  </div>
                </div>
              </li>
              <li
                class="issue"
                :class="{
                  ok: unsupportedTagsOk,
                  bad: !unsupportedTagsOk,
                  critical: !unsupportedTagsOk,
                }"
                role="button"
                tabindex="0"
                :aria-expanded="open.unsupportedTags"
                @click="open.unsupportedTags = !open.unsupportedTags"
                @keydown.enter.prevent="
                  open.unsupportedTags = !open.unsupportedTags
                "
                @keydown.space.prevent="
                  open.unsupportedTags = !open.unsupportedTags
                "
              >
                <div class="status">
                  <svg
                    v-if="unsupportedTagsOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.unsupportedHtmlTags") }}
                    <span class="badge bounce">critical</span>
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.unsupportedHtmlTagsHelp") }}
                  </div>
                  <div v-if="open.unsupportedTags" class="details">
                    {{
                      t("tools.emailAnalyzer.unsupportedHtmlTagsDetails", {
                        tags:
                          unsupportedTags.join(", ") ||
                          t("tools.emailAnalyzer.none"),
                      })
                    }}
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <section class="group">
            <header>
              <h3>
                {{
                  t("tools.emailAnalyzer.typeSpecificRules", {
                    type: t(typeLabelKey),
                  })
                }}
              </h3>
            </header>
            <ul class="issues">
              <li
                v-if="showUnsubscribe"
                class="issue"
                :class="{
                  ok: unsubscribeOk,
                  bad: !unsubscribeOk,
                  critical: !unsubscribeOk,
                }"
                role="button"
                tabindex="0"
                :aria-expanded="open.unsubscribe"
                @click="open.unsubscribe = !open.unsubscribe"
                @keydown.enter.prevent="open.unsubscribe = !open.unsubscribe"
                @keydown.space.prevent="open.unsubscribe = !open.unsubscribe"
              >
                <div class="status">
                  <svg
                    v-if="unsubscribeOk"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"
                    />
                  </svg>
                </div>
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.unsubscribeMissing") }}
                    <span class="badge bounce">bounce</span>
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.unsubscribeMissingHelp") }}
                  </div>
                  <div v-if="open.unsubscribe" class="details">
                    {{
                      t("tools.emailAnalyzer.unsubscribeDetails", {
                        keywords: keywords.join(", "),
                        found:
                          foundKeywords.join(", ") ||
                          t("tools.emailAnalyzer.none"),
                      })
                    }}
                    <div class="example">
                      <div class="example-title">
                        {{ t("tools.emailAnalyzer.validation") }}
                      </div>
                      <p class="desc">
                        {{ t("tools.emailAnalyzer.unsubscribeValidation") }}
                      </p>
                      <div class="ex-row">
                        <div class="good">
                          <strong
                            >✓
                            {{ t("tools.emailAnalyzer.goodExample") }}</strong
                          >
                          <pre><code>&lt;p style="font-size:12px;color:#6b7280"&gt;
  {{ t('tools.emailAnalyzer.unsubscribeText') }}
  &lt;a href="https://example.com/unsubscribe"&gt;{{ t('tools.emailAnalyzer.unsubscribeCta') }}&lt;/a&gt;.
&lt;/p&gt;</code></pre>
                        </div>
                        <div class="bad">
                          <strong
                            >✗ {{ t("tools.emailAnalyzer.badExample") }}</strong
                          >
                          <pre><code>&lt;p&gt;{{ t('tools.emailAnalyzer.noUnsubscribe') }}&lt;/p&gt;</code></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-else class="issue info">
                <div class="status" />
                <div class="content">
                  <div class="label">
                    {{ t("tools.emailAnalyzer.noTypeRules") }}
                  </div>
                  <div class="helper">
                    {{ t("tools.emailAnalyzer.noTypeRulesHelper") }}
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useHead } from "nuxt/app";
import ToolShell from "~/components/layout/ToolShell.vue";
import UiSelect from "~/components/UI/Select.vue";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

definePageMeta({
  alias: [
    "/email-analyzer",
    "/pt-br/email-analyzer",
    "/en/email-analyzer",
    "/es/email-analyzer",
  ],
});

useHead({
  title: computed(() => t("meta.emailAnalyzer.title")),
  meta: [
    {
      name: "description",
      content: computed(() => t("meta.emailAnalyzer.description")),
    },
  ],
});

const html = ref("");

const emailType = ref<"transactional" | "marketing" | "notification" | "other">(
  "marketing",
);
const typeOptions = computed(() => [
  { value: "transactional", label: t("tools.emailAnalyzer.typeTransactional") },
  { value: "marketing", label: t("tools.emailAnalyzer.typeMarketing") },
  { value: "notification", label: t("tools.emailAnalyzer.typeNotification") },
  { value: "other", label: t("tools.emailAnalyzer.typeOther") },
]);

const thresholds: Record<string, number> = {
  transactional: 1,
  marketing: 2,
  notification: 1,
  other: 3,
};
const maxExclamations = computed(() => thresholds[emailType.value]);

const typeLabelKey = computed(() =>
  emailType.value === "transactional"
    ? "tools.emailAnalyzer.typeTransactional"
    : emailType.value === "marketing"
      ? "tools.emailAnalyzer.typeMarketing"
      : emailType.value === "notification"
        ? "tools.emailAnalyzer.typeNotification"
        : "tools.emailAnalyzer.typeOther",
);

const showUnsubscribe = computed(
  () => emailType.value === "marketing" || emailType.value === "notification",
);

const open = ref({
  exclamations: false,
  alts: false,
  unsubscribe: false,
  spamWords: false,
  capsLock: false,
  emailWidth: false,
  unsupportedTags: false,
});

const textOnly = computed(() => html.value.replace(/<[^>]*>/g, ""));

const exclamationsCount = computed(
  () => (textOnly.value.match(/!/g) || []).length,
);
const exclamationsOk = computed(
  () => exclamationsCount.value <= maxExclamations.value,
);

const imgsWithoutAlt = ref(0);
const altsOk = computed(() => imgsWithoutAlt.value === 0);

const hasUnsubscribe = ref(false);
const unsubscribeOk = computed(() => hasUnsubscribe.value);
const foundKeywords = ref<string[]>([]);
const keywords = ["unsubscribe", "descadastro", "unsub", "opt-out", "optout"];

// New validation rules
const spamWords = [
  "free",
  "urgent",
  "limited time",
  "act now",
  "click here",
  "guarantee",
  "no risk",
  "winner",
  "congratulations",
  "gratuito",
  "urgente",
  "clique aqui",
  "garantia",
  "vencedor",
  "parabéns",
];
const foundSpamWords = ref<string[]>([]);
const spamWordsOk = computed(() => foundSpamWords.value.length === 0);

const capsLockPercentage = ref(0);
const capsLockOk = computed(() => capsLockPercentage.value <= 30);

const emailWidth = ref(0);
const emailWidthOk = computed(
  () => emailWidth.value <= 600 || emailWidth.value === 0,
);

const unsupportedTags = ref<string[]>([]);
const unsupportedTagsOk = computed(() => unsupportedTags.value.length === 0);

const problems = computed(() => {
  const items = [] as Array<
    | "exclamations"
    | "alts"
    | "unsubscribe"
    | "spamWords"
    | "capsLock"
    | "emailWidth"
    | "unsupportedTags"
  >;
  if (!exclamationsOk.value) items.push("exclamations");
  if (!altsOk.value) items.push("alts");
  if (showUnsubscribe.value && !unsubscribeOk.value) items.push("unsubscribe");
  if (!spamWordsOk.value) items.push("spamWords");
  if (!capsLockOk.value) items.push("capsLock");
  if (!emailWidthOk.value) items.push("emailWidth");
  if (!unsupportedTagsOk.value) items.push("unsupportedTags");
  return items;
});

const criticalCount = computed(() => {
  let count = 0;
  if (showUnsubscribe.value && !unsubscribeOk.value) count++;
  if (!unsupportedTagsOk.value) count++;
  return count;
});

function analyze() {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html.value, "text/html");
    const imgs = Array.from(doc.querySelectorAll("img"));
    imgsWithoutAlt.value = imgs.filter(
      (img) => !img.hasAttribute("alt") || img.getAttribute("alt") === "",
    ).length;

    const links = Array.from(doc.querySelectorAll("a"));
    const htmlLower = doc.body?.innerHTML.toLowerCase() || "";
    const textLower = doc.body?.textContent?.toLowerCase() || "";
    const hits = new Set<string>();
    for (const k of keywords) {
      if (
        links.some((a) =>
          (a.href + (a.textContent || "")).toLowerCase().includes(k),
        ) ||
        htmlLower.includes(k) ||
        textLower.includes(k)
      ) {
        hits.add(k);
      }
    }
    foundKeywords.value = Array.from(hits);
    hasUnsubscribe.value = foundKeywords.value.length > 0;

    // New validations
    // Spam words detection
    const spamHits = new Set<string>();
    for (const word of spamWords) {
      if (textLower.includes(word.toLowerCase())) {
        spamHits.add(word);
      }
    }
    foundSpamWords.value = Array.from(spamHits);

    // CAPS LOCK detection
    const text = doc.body?.textContent || "";
    const letters = text.replace(/[^a-zA-Z]/g, "");
    const upperLetters = text.replace(/[^A-Z]/g, "");
    capsLockPercentage.value =
      letters.length > 0
        ? Math.round((upperLetters.length / letters.length) * 100)
        : 0;

    // Email width detection
    const tables = Array.from(doc.querySelectorAll("table"));
    const divs = Array.from(doc.querySelectorAll("div"));
    let maxWidth = 0;
    [...tables, ...divs].forEach((el) => {
      const width = el.getAttribute("width") || el.style.width;
      if (width) {
        const numWidth = parseInt(width.replace(/px|%/, ""));
        if (numWidth > maxWidth) maxWidth = numWidth;
      }
    });
    emailWidth.value = maxWidth;

    // Unsupported tags detection
    const badTags = ["script", "form", "input", "iframe", "object", "embed"];
    const foundBadTags = new Set<string>();
    for (const tag of badTags) {
      if (doc.querySelectorAll(tag).length > 0) {
        foundBadTags.add(tag);
      }
    }
    unsupportedTags.value = Array.from(foundBadTags);
  } catch {
    // Fallback (very basic) if DOMParser not available
    imgsWithoutAlt.value = (html.value.match(/<img\b[^>]*>/gi) || []).filter(
      (tag) => !/\balt\s*=\s*["'][^"']*["']/gi.test(tag),
    ).length;
    const lower = html.value.toLowerCase();
    const hit = lower.match(/unsubscribe|descadastro|opt-out|optout|unsub/g);
    foundKeywords.value = Array.from(new Set(hit || []));
    hasUnsubscribe.value = foundKeywords.value.length > 0;

    // Fallback for new validations
    const spamHits = new Set<string>();
    for (const word of spamWords) {
      if (lower.includes(word.toLowerCase())) {
        spamHits.add(word);
      }
    }
    foundSpamWords.value = Array.from(spamHits);

    const text = html.value.replace(/<[^>]*>/g, "");
    const letters = text.replace(/[^a-zA-Z]/g, "");
    const upperLetters = text.replace(/[^A-Z]/g, "");
    capsLockPercentage.value =
      letters.length > 0
        ? Math.round((upperLetters.length / letters.length) * 100)
        : 0;

    const widthMatch = html.value.match(/width=["']?(\d+)/i);
    emailWidth.value = widthMatch ? parseInt(widthMatch[1]) : 0;

    const badTags = ["script", "form", "input", "iframe", "object", "embed"];
    const foundBadTags = new Set<string>();
    for (const tag of badTags) {
      if (html.value.toLowerCase().includes(`<${tag}`)) {
        foundBadTags.add(tag);
      }
    }
    unsupportedTags.value = Array.from(foundBadTags);
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem("emailAnalyzer:input");
    if (saved) {
      html.value = saved;
    }
  } catch {
    // localStorage not available
  }
  analyze();
});

watch(html, (newValue) => {
  analyze();
  try {
    localStorage.setItem("emailAnalyzer:input", newValue);
  } catch {
    // localStorage not available
  }
});

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    html.value = content;
    try {
      localStorage.setItem("emailAnalyzer:input", content);
    } catch {
      // localStorage not available
    }
  };
  reader.readAsText(file);
}
</script>

<style scoped>
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
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-btn {
  padding: 6px 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.upload-btn:hover {
  background: var(--muted);
}
textarea {
  width: 100%;
  min-height: 300px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.controls {
  display: flex;
  justify-content: flex-end;
}
.summary {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  padding: 8px 12px;
  border-radius: 10px;
}
.summary-item .count {
  font-weight: 700;
}
.summary-item.critical {
  border-color: #fca5a5;
  background: color-mix(in lab, #ef4444 10%, var(--card));
}

.results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.group {
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 12px;
}
.group > header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.group h3 {
  margin: 0;
  font-size: 16px;
}
.issues {
  list-style: none;
  margin: 0;
  padding: 0;
}
.issue {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  align-items: flex-start;
}
.issue:first-child {
  border-top: 0;
}
.issue.ok .status {
  color: #22c55e;
}
.issue.bad .status {
  color: #f59e0b;
}
.issue.critical {
  background: color-mix(in lab, #ef4444 8%, var(--card));
}
.issue.info {
  background: color-mix(in lab, #e5e7eb 20%, var(--card));
}
.status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content .label {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.content .helper {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
}
.details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
  color: hsl(var(--muted-foreground));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 13px;
}
.badge {
  text-transform: uppercase;
  font-size: 11px;
  border-radius: 999px;
  padding: 2px 8px;
  border: 1px solid var(--border);
  color: var(--text);
}
.badge.spam {
  background: #fee2e2;
  border-color: #fecaca;
}
.badge.bounce {
  background: #fef3c7;
  border-color: #fde68a;
}
.badge.mobile {
  background: #e0e7ff;
  border-color: #c7d2fe;
}
.issue[role="button"] {
  cursor: pointer;
}
.example {
  margin-top: 8px;
}
.example-title {
  font-weight: 600;
  margin-bottom: 6px;
}
.details pre {
  margin: 0;
  padding: 8px;
  border-radius: 8px;
  background: var(--card);
  border: 1px solid var(--border);
  overflow: auto;
}
.ex-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
}
.good {
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 8px;
}
.bad {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px;
}
.desc {
  color: hsl(var(--muted-foreground));
  margin: 4px 0 6px;
}
</style>
