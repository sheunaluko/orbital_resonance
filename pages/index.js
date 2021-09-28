import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import "animate.css"


import {
    Link 
} from "./core_imports.js" 


export default function Home() {
    return (
	<div className={styles.container}>
	<Head>
        <title>Orbital Resonance</title>
        <meta name="description" content="Orbital Resonance Digital Art NFTs" />
        <link rel="icon" href="/favicon.ico" />
	</Head>

	<main className={styles.main}>

	    <h1 className={styles.title} className="animate__animated animate__bounce ">O r b i t a l - R e s o n a n c e</h1>


	
	<div id="forCanvas">
	</div> 

	<span> 
	<Link href="/">
	<a> Mint </a>
	</Link>

 	
	<Link href="/">
	<a> |  </a>
	</Link>
 	
	<Link href="/healing_nfts_creator">
	<a> About  </a>
	</Link>

	</span> 

	

        <a
        href="" 
        target="_blank"
        rel="noopener noreferrer"
        >
        H e a l i n g - N F T s . a r t  {' '}
	
        </a>



	</main>
	
	</div>


    )
}
