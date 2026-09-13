import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import * as rootParams from 'next/root-params'

import { routing } from './routing'

/**
 * 每个请求的语言来自 `app/[locale]` 这个根参数（next/root-params），
 * 任何 Server Component 都能直接 getLocale() / useLocale()，不用把 locale 一层层传下去。
 * `locale` 参数只在显式覆盖时才有值（比如 getTranslations({ locale }))。
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const param = await rootParams.locale()
    if (hasLocale(routing.locales, param)) locale = param
    else notFound()
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
