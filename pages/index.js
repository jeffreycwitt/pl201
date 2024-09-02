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
        {posts.sort((a, b) => {
          const orderA = a.data.order !== undefined ? a.data.order : Number.MAX_SAFE_INTEGER;
          const orderB = b.data.order !== undefined ? b.data.order : Number.MAX_SAFE_INTEGER;
          if (orderA < orderB) {
            return -1;
          }
          else if (orderA > orderB) {
            return 1
          }
          else {
            return 0
          }
        }).map((post) => {
          if (post.data.published){
            return (
              <li key={post.filePath}>
                <span>Class {post.data.order}: </span>
                <Link
                  as={`/posts/${post.filePath.replace(/\.mdx?$/, '')}`}
                  href={`/posts/[slug]`}
                >
                  <a>{post.data.title}</a>
                </Link>
              </li>
              )
            }
            else{
              return null
            }
        })
      }
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
