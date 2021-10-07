import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import "animate.css"

import {
    Link ,
    Marquee,
    loadScript,
    animateCSS,
    server_render , 
} from "../src/core_imports.js"

import {ExplorerWidget} from "../src/widgets.js"  ; 

export async function getStaticProps() {
  return {
    props: {
        tokenData : 20 , 
    },
      revalidate: 1,  
  }
}

export default function App() {

    return (
	<div >
	  <Head>
            <title>Orbital Resonance</title>
            <meta name="description" content="Orbital Resonance Digital Art NFTs" />
            <link rel="icon" href="/favicon.ico" />
	  </Head>

	  <main className={styles.main}>
	    <h1 className={"animate__animated animate__pulse" }>E x p l o r e r</h1>

            <ExplorerWidget/>
            
	    <div className={styles.foot}> 
	      <span> 
	        <Link href="/">
	          <a> Home </a>
	        </Link>

 	        
	        <Link href="/">
	          <a> |  </a>
	        </Link>
 	        
	        <Link href="/healing_nfts_creator">
	          <a> About  </a>
	        </Link>

	      </span> 

	      <br/> 

              <a
                href="" 
                target="_blank"
                rel="noopener noreferrer"
              >
                H e a l i n g - N F T s . a r t  {' '}
	        
              </a>
	    </div> 

	  </main>
	  
	</div>


    )
}
