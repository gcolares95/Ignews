import Head from 'next/head';
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>    

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Titulo do post em si</strong>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi eius omnis ipsa, animi dignissimos eaque quos non suscipit nemo quod</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication') 
  ], {
    fetch: ['publication.title',  'publication.content'], // dados para buscar da publicação
    pageSize: 100,
  })

  console.log(JSON.stringify(response, null, 2));
  //JSON.stringify(obj, null, indentacao)

  return {
    props: {}
  }
}