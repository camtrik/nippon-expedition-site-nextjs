export default async function ChangelogPage({ params }: PageProps<'/[lang]/changelog'>) {
  const { lang } = await params
  return <main><h1>更新记录 / Changelog — {lang}</h1></main>
}
