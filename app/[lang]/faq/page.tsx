export default async function FaqPage({ params }: PageProps<'/[lang]/faq'>) {
  const { lang } = await params
  return <main><h1>常见问题 / FAQ — {lang}</h1></main>
}
