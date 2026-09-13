// next-intl 的类型增强：t() 的键名和 Locale 都从这里推出来，写错键名是编译错误。
// 以中文词表为准——英文那份的键集合是否一致由 scripts/validate-content.ts 检查。
import type { routing } from '@/i18n/routing'
import type messages from '@/messages/zh.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
