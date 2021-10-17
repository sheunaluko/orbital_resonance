import Link from 'next/link'
import Image from 'next/image'
import Marquee from "react-fast-marquee";

function server_render() {  return (typeof window === "undefined") }


const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  })

const loadScript = (url,callback) => {

    if (!server_render()) { 
	let el_id = ('SCRIPT_IMPORT_ID_' + url) 
	const existingScript = document.getElementById(el_id);
	if (!existingScript) {
	    const script = document.createElement('script');
	    script.src = url ; 
	    script.id =  el_id  ;
	    script.crossorigin = "anonymous" ;
	    script.referrerpolicy = "no-referrer"	 ; 
	    document.body.appendChild(script);
	    script.onload = () => { 
		if (callback) callback();
	    };
	}
	if (existingScript && callback) callback();
    }
    
};


/* 
   Async utility functions 
 */

let ms = ()=> performance.now()

export function wait_until(f, timeout , rate){
    var t_start = ms() 
    rate = rate || 200 ; 
    let p = new Promise((resolve ,reject) =>   { 
	let id = setInterval( function(){ 
	    let t_now  = ms() 
	    if (f()) { 
		//condition is met 
		resolve(false) 		
		clearInterval(id)
	    }  else { 
		let elapsed =  t_now - t_start
		if (timeout && elapsed  >= timeout ) { 
		    resolve(true) // reports an timeout
		    clearInterval(id) 
		}
	    }
	},rate) 
    }) 
    //return the promise now 
    return p
}

export function wait(t ) {
    return new Promise( (res,rej) => {
	setTimeout( function(){
	    res(true) 
	} , t ) 
    } ) 
}


export function Logger(name ) { 
    return function(v ) { 
	
	if (false) {
	    if (!params.log_pass.includes(name)) {
		return 
	    }
	} 
	
	if (typeof v === "object" ) { 
	    console.log(`[${name}]::`)
	    console.log(v) 
	}  else { 
	    console.log(`[${name}]:: ${v}`)
	} 
    } 
    
} 


export var full_height_style = `
      html,
      body,
      body > div:first-child,
      div#__next,
      div#__next > div {
        height: 100%;
      }
    `    


let core_imports = {
    Link,
    Image,
    Marquee ,
    loadScript,
    animateCSS,
    server_render,
    ms,
    wait_until,
    wait,
    Logger , 
} 


module.exports = core_imports ;  

if (!server_render()) {     window.core_imports = core_imports ;  }  

