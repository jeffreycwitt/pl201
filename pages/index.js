import fs from 'fs'
import matter from 'gray-matter'
import Link from 'next/link'
import path from 'path'
import Layout from '../components/Layout'
import { postFilePaths, POSTS_PATH } from '../utils/mdxUtils'

export default function Index({ posts }) {
  return (
    <Layout>
      <h1>PL 201 Guided Reading Questions</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.filePath}>
            <Link
              as={`posts/${post.filePath.replace(/\.mdx?$/, '')}`}
              href={`posts/[slug]`}
            >
              <a>{post.data.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export function getStaticProps() {
  const posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
    const { content, data } = matter(source)

    return {
      content,
      data,
      filePath,
    }
  })

  return { props: { posts } }
}
