export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  return <main><h1>简介 / Overview — {lang}</h1></main>
}
