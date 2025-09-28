import Link from "next/link"
import { client } from "../lib/sanity"

export default function Home({ articles }) {
  return (
    <main className="container-prose py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">HomeRates.ai Articles</h1>
        <p className="text-sm text-gray-500">Fresh posts from your Sanity CMS</p>
      </header>

      {articles.length === 0 && (
        <p className="text-gray-600">No articles yet. Publish one in Studio and refresh.</p>
      )}

      <ul className="grid gap-6">
        {articles.map((a) => (
          <li key={a._id} className="rounded-2xl border p-5 hover:shadow-sm transition">
            <h2 className="text-xl font-medium">
              <Link href={`/articles/${a.slug?.current ?? ""}`} className="hover:underline">
                {a.title}
              </Link>
            </h2>
            {a.excerpt && <p className="mt-2 text-gray-700">{a.excerpt}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}

export async function getStaticProps() {
  const query = `*[_type == "article"]{_id, title, excerpt, slug}|order(_createdAt desc)`
  const articles = await client.fetch(query)
  return { props: { articles }, revalidate: 60 }
}
