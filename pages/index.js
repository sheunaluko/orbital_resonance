import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import {
    Link ,
    Marquee,
    loadScript,
    animateCSS, 
} from "../src/core_imports.js"

import {IndexWidget} from "../src/IndexWidget.js"

/*
   dynamically load p5js 
 */
await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" , ()=>{console.log("loaded p5")}) ;

// -- 


export default function Home() {
    return (
	<div className={styles.container}>
	<Head>
        <title>Orbital Resonance</title>
        <meta name="description" content="Orbital Resonance Digital Art NFTs" />
        <link rel="icon" href="/favicon.ico" />
	</Head>

	<main className={styles.main}>

	    <div style={{width: "100%", display :"flex", flexDirection : "row", justifyContent : 'center', alignItems : "center" }}>

	    <h1 className={"animate__animated animate__bounce" }>O r b i t a l</h1>

	    &nbsp; 	    &nbsp; 	    &nbsp; 	   

	    <h1 className={"animate__animated animate__bounce" }>R e s o n a n c e</h1>	

	

	</div> 


	    <IndexWidget />
	


	<div className={styles.foot}> 
	    <span>

	    <Link href="https://docs.orbital-resonance.art">
	<a> Docs  </a>
	</Link>	

	    &bull;
 	
	<Link href="/art_blocks">
	<a> Art Blocks  </a>
	</Link>

	&bull;

	<Link href="/explorer">
	<a> Explorer </a>
	    </Link>

	&bull;

	<Link href="https://github.com/sheunaluko/orbital_resonance">
	<a> Github </a>
	</Link>	
	
	
	</span> 

	<br/> 

	</div> 

        <div style={{position:"absolute" , right : 20 , bottom : 20 , fontSize : '12px'}}>
            	<Link href="https://github.com/sheunaluko/orbital_resonance">
	          <a> v0.2 </a>
	        </Link>	

          </div>

	</main>
	
	</div>


    )
}
