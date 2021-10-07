import {useEffect} from 'react' ; 

import styles from '../styles/Explorer.module.css'

import {
    Link ,
    Marquee,
    loadScript,
    animateCSS,
    server_render ,
    wait_until ,
    Logger ,
    wait, 
} from "./core_imports.js" ; 

import {
    getRNG ,
    getRandomParams,  
} from "./graphics/art_blocks_utils"

import {
    Slider, 
} from "./mui" 
var log = Logger("widgets") ;



export function ExplorerWidget()  {



let OrbitalSketch = function(p) {
    let dim_sc = 0.6 
    let dim = dim_sc * Math.min(window.innerWidth, window.innerHeight) ;
    let default_x_start = 0.2* dim  ; 
    console.log(`Min dim is ${dim}`)



    let get_drawer = function(params) {
	let {acc_scale}  =  params ; 
	//set up persistent variables in this closure
	let x_start = params.x_start || default_x_start ; 
	//console.log("x_start:" + x_start) ;
	let pos = p.createVector(x_start,0) ;  let vel = p.createVector(0,4) ; 
	return function() {
	    let acc = p.createVector(0 - pos.x, 0 - pos.y) ;
	    //console.log(acc) ; 
	    acc.mult(1/acc.mag()) ;
	    acc.mult(acc_scale); 
	    vel.add(acc) ;  
	    let old_pos = pos.copy() 
	    pos.add(vel) ; 
	    //update time and position  and return a copy 
	    return pos.copy() 	
	}
    }

    let get_points = function(params) {
	let dfn = get_drawer(params) ; let pts = [] 
	for (var i=0; i < params.iterations ; i++) { pts.push(dfn()) } ; return pts ; 
    }

    let display_points = async function(pts) {
	p.fill(0); let old_pos = null; 
	for (var pos of pts) {
	    p.ellipse(0,0,params.center_sz)  ;
	    p.ellipse(pos.x,pos.y , params.dot_sz)
	    if (params.lines && old_pos) {
		p.line(old_pos.x,old_pos.y, pos.x,pos.y) ;	    
	    }
	    old_pos = pos.copy()

	    /* 
	       Can have an optional delay here to change how quickly the dots are drawn 
	    */
	    if (params.draw_interval ) { 
		let delay = await wait( params.draw_interval )
	    } 
	} 
    }

    
    let params = {
	'iterations' : 3000, 
	'dot_sz'     : 2, 
	'lines'      : false, 
	'center_sz'  : 4 ,
	'acc_scale'  : 2 ,
	'draw_interval' : 0  , 
    } 

    /*
    setInterval( function() {
	params.acc_scale += 0.05 ; 
    } , 20) 
    */ 

    p.setup = async function() {
	p.createCanvas(dim,dim, p.WEBGL)  ;
    }


    let get_total_acc = function() {
        let acc = Number(document.querySelector("#explorer_acc_slider input").value)
        let acc_fine = Number(document.querySelector("#explorer_acc_fine_slider input").value)
        return acc + acc_fine 
    } 
    
    p.draw = async function() {
	p.clear() ;
        let total_acc = get_total_acc() ;  
        params.acc_scale = total_acc ; 
        document.querySelector("#acc_report").innerHTML = "Acceleration: " + total_acc ; 
	let pts = await get_points(params) ; 
	await display_points(pts) 
    } 
    
} 


    let Controls = function() {
	return (
            <div className={styles.explorer_controls}>

	    </div> 
	) 
    } 

    if (!server_render()) { 
        useEffect( async ()=> {
	    
            console.log("Explorer loaded") ;
	    console.log(window) ;

	    
	    /*
	      dynamically load p5js 
	    */

	    let v = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" , ()=>{console.log("Explorer requested p5")}) ; 


	    let timedOut = await wait_until( ()=> window.p5  , 10000, 100) ;
	    if (timedOut) { log("timedout") } else { log("Detected p5")  } ; 
	   

	    if (!server_render()) { 
		window.ep = new window.p5(OrbitalSketch, window.document.getElementById('explorerMainContainer'));
	    } 
	    
	})
	
    }

    return (
        <div>
          <div className={styles.explorer}>
            <div className={styles.control_pane}>
              {Controls()}            
            </div>
            <div id="explorerMainContainer" className={styles.explorer_pane}>
            </div>
            <div className={styles.control_pane}>
              {Controls()}            
            </div>
            
          </div>
          <br/>

          <div id="acc_report"  style={{}} >
           Acceleration: 0 
         </div>
          
          <div className={styles.acc_slider} >
            <div style={{display : "flex" , flexDirection : "column" , justifyContent : "center"  }}>
              Coarse Adjust
            </div>
            <div style={{flexGrow : 1  , marginLeft : "10px"  ,  display : "flex" , flexDirection : "column" , justifyContent : "center"  }}> 
              <Slider
                id="explorer_acc_slider" 
                size="small"
                step={0.1}
                min={0}
                max={200}
                defaultValue={70}
                aria-label="Small"

              />
            </div>
          </div>

          <div className={styles.acc_slider} >
            <div style={{display : "flex" , flexDirection : "column" , justifyContent : "center"  }}>
              Fine Adjust
            </div>
            <div style={{flexGrow : 1  , marginLeft : "10px"  ,  display : "flex" , flexDirection : "column" , justifyContent : "center"  }}> 
              <Slider
                id="explorer_acc_fine_slider" 
                size="small"
                step={0.001}
                min={-10}
                max={10}
                defaultValue={0}
                aria-label="Small"
              />
            </div>
          </div>
          
          
        </div>
    ) 

    
} 










