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
	let dim_sc = 1
	let dim = dim_sc * Math.min(window.innerWidth, window.innerHeight) ;
	let default_x_start = 0.5* dim  ; 
	console.log(`Min dim is ${dim}`)



	let get_drawer = function(params) {
	    let {acc : _acc, acc_fine, acc_ultra_fine,  v_start}  =  params ; 
	    //set up persistent variables in this closure
	    let x_start = params.x_start || default_x_start ; 
	    //console.log("x_start:" + x_start) ;
	    let pos = p.createVector(x_start,0) ;  let vel = p.createVector(0,v_start) ; 
	    return function() {
		let acc = p.createVector(0 - pos.x, 0 - pos.y) ;
		//console.log(acc) ; 
		acc.mult(1/acc.mag()) ;
		acc.mult(_acc + acc_fine  + acc_ultra_fine); 
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
                    //console.log(window.performance.now() ) 
		    let delay = await wait( params.draw_interval )
		} 
	    } 
	}

	
	let params = {
	    'iterations' : 3000,
            'iterationsMin' : 0,
            'iterationsMax' : 100000,
            'iterationsStep' : 50 , 
	    'dot_sz'     : 2, 
	    'lines'      : false, 
	    'center_sz'  : 4 ,
	    'acc'  : 2 ,
	    'accMin'  : 0 ,
	    'accMax'  : 11 ,
	    'accStep'  : 0.01 ,
	    'acc_fine'  : 0 ,
	    'acc_fineMin'  : -0.03 ,
	    'acc_fineMax'  : 0.03 ,
	    'acc_fineStep'  : 0.0001 ,                        
	    'acc_ultra_fine'  : 0 ,
	    'acc_ultra_fineMin'  : -0.003 ,
	    'acc_ultra_fineMax'  : 0.003 ,
	    'acc_ultra_fineStep'  : 0.00001 ,                        
            'x_start'    : default_x_start ,
            'v_start'    : 4, 
	    'draw_interval' : 0  , 
	} 

	/*
	  setInterval( function() {
	  params.acc_scale += 0.05 ; 
	  } , 20) 
	*/ 

	p.setup = async function() {
	    p.createCanvas(dim,dim, p.WEBGL)  ;
	    var gui = p.createGui(this, 'Orbital Config');
	    gui.addObject(params);

	}


        //var last_param_str = null ;
        var hash = function(p) {
            return JSON.stringify(p)
        }

        var pphash = null  ; 
        
	p.draw = async function() {

            if (pphash == hash(params)) {
                return 
            }

            console.log("Rendering new params!") 
            
            p.clear() 
	    let pts = await get_points(params) ;
	    await display_points(pts)

            pphash = hash(params) 

	} 
	
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


	    await loadScript("/src/p5.gui.js" , ()=>{console.log("Explorer requested p5.gui")}) ; 
	    await loadScript("/src/quicksettings.js" , ()=>{console.log("Explorer requested QS")}) ;


	    await wait_until( ()=> window.p5.prototype.createGui  , 10000, 100) ;	    	    

	    if (!server_render()) { 
		window.ep = new window.p5(OrbitalSketch, window.document.getElementById('explorerMainContainer'));
	    } 
	    
	})
	
    }

    return (
        <div id="explorerMainContainer" className={styles.explorer_pane}>
            </div>
    ) 

    
} 










