/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FRONTEND_BASE_URL?: string;
  readonly VITE_DISCORD_OAUTH_REDIRECT?: string;
  readonly VITE_DISCORD_BOT_INVITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

