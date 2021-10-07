import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import "animate.css"



import {
    Link ,
    Marquee,
    loadScript, 
} from "../src/core_imports.js" 

/*
   dynamically load p5js 
 */
await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" , ()=>{console.log("loaded p5")}) ;

// -- 

let imgs = Array(17).fill(0).map( (v,i) => `/images/example_imgs/o${i+1}.png` )
let w = "410px" ; 
let h = "400px" ; 

export default function Home() {
    return (
	<div className={styles.container}>
	<Head>
        <title>Orbital Resonance</title>
        <meta name="description" content="Orbital Resonance Digital Art NFTs" />
        <link rel="icon" href="/favicon.ico" />
	</Head>

	<main className={styles.main}>

	<h1 className={"animate__animated animate__bounce" }>O r b i t a l - R e s o n a n c e</h1>



	<Marquee
	speed={70}
	>
	{
	    imgs.map( i => <div key={i} className={styles.imageContainer}>
		<Image src={i} width={w} height={h} />
		</div> 
	    )
	} 
	</Marquee>
	<div id="forCanvas">
	</div> 


	<div className={styles.foot}> 
	<span> 
	<Link href="/explorer">
	<a> Explorer </a>
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
