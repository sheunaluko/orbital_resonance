import {useEffect} from 'react' ;

import {
    loadScript,
    animateCSS,
    server_render ,
    wait,
    wait_until, 
} from "./core_imports.js" ; 

import {
    params,
    Sketch,
    random_params 
} from "./ABsketch.js" 

export function IndexWidget()  {
    if (!server_render()) { 
        useEffect( async ()=> {
            console.log("Index Widget loaded") ;
	    /*
	      dynamically load p5js 
	    */
	    let v = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" , ()=>{console.log("Explorer requested p5")}) ; 
	    let timedOut = await wait_until( ()=> window.p5  , 10000, 100) ;
	    if (timedOut) { console.log("timedout") } else { console.log("Detected p5")  } ;
	    await wait_until( ()=> window.p5, 10000, 100) ;
	    random_params() ; 
	    window.ep = new window.p5(Sketch, window.document.getElementById('IndexWidget'));
	    setInterval( random_params , 1500 ); 
	})
    }
    return (
	    <div id="IndexWidget" /> 
    )
}












