import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Explorer.module.css'
import {useState, useEffect } from 'react' 

import "animate.css"

import {
    Link ,
    Marquee,
    loadScript,
    animateCSS,
    server_render ,
    full_height_style, 
} from "../src/core_imports.js"

import {ExplorerWidget} from "../src/widgets.js"  ;



export default function App() {

    return (
	<div style={{height : "100%"}}>
	  <Head>
            <title>Orbital Resonance</title>
            <meta name="description" content="Orbital Resonance Digital Art NFTs" />
            <link rel="icon" href="/favicon.ico" />
	  </Head>

          <main className={styles.explorer_main}  >

            <div style={{height : "100%"}}>
              <ExplorerWidget/>
            </div>

	  

	  </main>


          <style jsx global>{`
            /* Other global styles such as 'html, body' etc... */

            html { 
              height : 100%; 
            }

            body { 
              height : 100%; 
            }

            #__next {
              height: 100%;
            }
          `}</style>
          
	</div>


    )
}



let Foot = function() {
    return (
        
	<div className={styles.foot}>
          <div style={{flexGrow : 1}} />
	<Link href="/">
	<a> Home </a>
	</Link>
        </div>


    ) 
} 

