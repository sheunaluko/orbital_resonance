import {
    Link ,
    Image, 
} from "../core_imports.js" 

let nums = [1,2,3,4,5,6,10 ] 

export default function FirstPost() {

    return ( <div>
	<ul>
	{ nums.map( n => (<li key={n}> {"Number " + n }  </li>) ) } 
	</ul>

	<Link href="/">
        <a>Back to home</a>
        </Link>

	<Image
	src="/images/orbital_1.png" // Route of the image file
	height={144} // Desired size with correct aspect ratio
	width={144} // Desired size with correct aspect ratio
	alt="Your Name"
	/>	
	
	</div> ) 
}



