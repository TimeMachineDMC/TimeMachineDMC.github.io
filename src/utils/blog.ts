import { getCollection } from 'astro:content'

import { sortMDByDate } from 'astro-pure/server'

export async function getPublishedBlogPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return sortMDByDate(posts)
}
