import Head from "next/head"
import { client } from "../../lib/sanity"

export default function Article({ article }) {
  if (!article) return <main className="container-prose py-10">Not found</main>
  return (
    <main className="container-prose py-10">
      <Head><title>{article.title} – HomeRates.ai</title></Head>
      <article className="prose prose-neutral max-w-none">
        <h1 className="mb-4">{article.title}</h1>
        {article.excerpt && <p className="text-gray-700">{article.excerpt}</p>}
        {Array.isArray(article.body) && article.body.length > 0 && (
          <div className="mt-6 space-y-3">
            {article.body.map((b, i) => (
              <p key={i}>{b.children?.map((c) => c.text).join("")}</p>
            ))}
          </div>
        )}
        {article.disclosure && (
          <div className="mt-8 text-xs text-gray-500 border-t pt-4">{article.disclosure}</div>
        )}
        {article.author && <div className="mt-2 text-xs text-gray-500">{article.author}</div>}
      </article>
    </main>
  )
}

export async function getStaticPaths() {
  const slugs = await client.fetch(`*[_type == "article" && defined(slug.current)][].slug.current`)
  const paths = slugs.map((s) => ({ params: { slug: s } }))
  return { paths, fallback: "blocking" }
}

export async function getStaticProps({ params }) {
  const query = `*[_type == "article" && slug.current == $slug][0]{_id, title, excerpt, body, disclosure, author, slug}`
  const article = await client.fetch(query, { slug: params.slug })
  if (!article) return { notFound: true, revalidate: 30 }
  return { props: { article }, revalidate: 60 }
}