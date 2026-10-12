import type { Metadata } from 'next'

import { CodexIndex } from '@/components/CodexIndex'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata('codex')
}

export default function CodexUnitsPage() {
  return <CodexIndex tab="units" />
}
