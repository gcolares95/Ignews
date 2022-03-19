import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import styles from './styles.module.scss';

// Separando Post em um type separado, pois Posts é um array ('boa prática')
type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.slug}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'], // dados para buscar da publicação
    pageSize: 100,
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid, // url do post
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type == 'paragraph')?.text ?? '', // pegando o 1° Parágrafo
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
  })

  return {
    props: {
      posts
    }
  }
}

// converte os formatos do prismic para html ou texto