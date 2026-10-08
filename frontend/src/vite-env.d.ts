/// <reference types="vite/client" />

// Declare Vite's import.meta.env shape for TypeScript
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Allow SVG imports
declare module '*.svg' {
  import React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

// Allow image imports
declare module '*.png' { const src: string; export default src }
declare module '*.jpg' { const src: string; export default src }
declare module '*.jpeg' { const src: string; export default src }
declare module '*.webp' { const src: string; export default src }
