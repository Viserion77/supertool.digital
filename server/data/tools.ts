// Embedded tools registry to avoid filesystem reads at runtime
// Keep this file as the single source of truth for tools
export default [
  {
    "category": "conversores",
    "path": "/base64-converter",
    "famous": true,
    "title": {
      "en": "Base64 Encoder/Decoder",
      "pt-br": "Conversor Base64",
      "es": "Codificador/Decodificador Base64"
    },
    "description": {
      "en": "Convert text, images and files to Base64 and back quickly and safely.",
      "pt-br": "Converta texto, imagens e arquivos para Base64 e vice-versa de forma rápida e segura.",
      "es": "Convierte texto, imágenes y archivos a Base64 y viceversa de forma rápida y segura."
    },
    "badges": [
      {
        "type": "popular",
        "color": "blue",
        "title": { "en": "Popular", "pt-br": "Popular", "es": "Popular" }
      }
    ],
    "keywords": ["base64","encode","decode"]
  },
  {
    "category": "geradores",
    "path": "/qr-code-generator",
    "title": {
      "en": "QR Code Generator",
      "pt-br": "Gerador de QR Code",
      "es": "Generador de Código QR"
    },
    "description": {
      "en": "Create customized QR codes for URLs, text and more.",
      "pt-br": "Gere códigos QR personalizados para URLs, textos e dados diversos.",
      "es": "Genera códigos QR personalizados para URLs, textos y datos diversos."
    },
    "badges": [
      { "type": "new", "color": "green", "title": { "en": "New", "pt-br": "Novo", "es": "Nuevo" } }
    ],
    "keywords": ["qr","code"]
  },
  {
    "category": "ferramentas-web",
    "path": "/jwt-analyzer",
    "famous": true,
    "title": {
      "en": "JWT Token Analyzer",
      "pt-br": "Analisador de Token JWT",
      "es": "Analizador de Token JWT"
    },
    "description": {
      "en": "Decode and inspect JWT tokens for debugging and validation.",
      "pt-br": "Decodifique e analise tokens JWT para debug e validação de autenticação.",
      "es": "Decodifica y analiza tokens JWT para depuración y validación."
    },
    "badges": [
      { "type": "popular", "color": "blue", "title": { "en": "Popular", "pt-br": "Famosinho", "es": "Popular" } }
    ],
    "keywords": ["jwt","token","decode"]
  },
  {
    "category": "ferramentas-web",
    "path": "/json-formatter",
    "title": {
      "en": "JSON Formatter",
      "pt-br": "JSON Formatter",
      "es": "Formateador JSON"
    },
    "description": {
      "en": "Format, validate and minify JSON with syntax highlighting.",
      "pt-br": "Formatar, validar e minificar seus arquivos JSON com syntax highlighting.",
      "es": "Formatea, valida y minimiza tus archivos JSON con resaltado de sintaxis."
    },
    "badges": [],
    "keywords": ["json","format","minify"]
  },
  {
    "category": "geradores",
    "path": "/color-palette-generator",
    "title": {
      "en": "Color Palette Generator",
      "pt-br": "Gerador de Paleta de Cores",
      "es": "Generador de Paletas de Colores"
    },
    "description": {
      "en": "Create harmonious color palettes for your projects.",
      "pt-br": "Crie paletas de cores harmoniosas para seus projetos de design.",
      "es": "Crea paletas de colores armoniosas para tus proyectos."
    },
    "badges": [],
    "keywords": ["color","palette"]
  },
  {
    "category": "documentacao",
    "path": "/jsdoc",
    "title": {
      "en": "JSDoc Generator",
      "pt-br": "Gerador de JSDoc",
      "es": "Generador de JSDoc"
    },
    "description": {
      "en": "Generate JSDoc from JSON or code snippets.",
      "pt-br": "Gere JSDoc a partir de JSON ou trechos de código.",
      "es": "Genera JSDoc a partir de JSON o fragmentos de código."
    },
    "badges": [],
    "keywords": ["jsdoc","docs"]
  }
] as const;
