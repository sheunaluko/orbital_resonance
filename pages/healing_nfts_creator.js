import {
    Link ,
    Image, 
} from "../src/core_imports.js" 



export default function E() {


    let about_orbital = "The Orbital-NFTs project began as an exploration. Based on a script of less than 20 lines of code, the orbital trajectory of an object is simulated based on one parameter - the strength of the accelerative force it feels to the center. Randomly varying this parameter produces a whole world of fascinating designs, all claimable as a unique NFT and each of which embodies the healing harmony of science and life. The simplicity of the script suggests that the images produced reflect a fundamental truth of our mathematical world - not unlike the world famous Mandelbrot fractal. Which orbital nft will you discover?"

    let about_creator = "Sheun Aluko, the creator of orbital-nfts.art, is a physician, software engineer, musician, and yoga practitioner who is of Nigerian and Singaporean background. Sheun - or Shay as most people call him - endeavors to infuse his art with elements of the beautiful harmony between the scientific and spiritual worlds. orbtial-nfts.art is part of a larger umbrella project which aims to create healing and inspiring digital art through coding. Head over to healing-nfts.art to learn more!"  

    return (
	    <div style={{padding : "10px"}}>


	
	    <h2>About Orbital-NFTs</h2>
	    <p>{about_orbital}</p>

	    <h2>What makes Orbital-NFTs unique?</h2>
	    <p>So many reasons...</p>


	    <h2>Who made this?</h2>
	    <p>{about_creator}</p>
	





	<Link href="/">
            <a style={{color : "blue"}}>Home </a>
        </Link>
	
	
	</div> 
    ) 
    
} 
