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
} from "../src/core_imports.js"

import {ABWidget} from "../src/ABWidget.js"  ;

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
              <ABWidget/>
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


