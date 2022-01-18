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


//utils
function get_square_size() { return Math.min(window.innerWidth, window.innerHeight) }

//export to window for dev purposes
if (!server_render()){ 
    window.widget_dev = {
	get_square_size , 
    } 
}

// define the sketch 
var Sketch = function(p) {
    
    let dim_sc = 0.8
    let M = dim_sc * get_square_size() 
    let default_x_start = 0.5*M  ; 
    console.log(`M=${M}`)
    
    let get_drawer = function(params) {
	let {acc : _acc, acc_fine, acc_ultra_fine,  v_start}  =  params ; 
	//set up persistent variables in this closure
	let x_start = default_x_start ; 
	//console.log("x_start:" + x_start) ;
	let pos = p.createVector(x_start,0) ;  let vel = p.createVector(0,0.01*M) ; 
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
        let n = -1 ; 
	for (var pos of pts) {
            n += 1 
	    p.ellipse(0,0,params.center_sz)  ;
            p.push() ;
            p.noStroke() ; 
            p.fill(0) ;
	    p.ellipse(pos.x,pos.y , params.dot_sz)
            p.pop() ;
            
	    if (params.lines && old_pos) {
		p.line(old_pos.x,old_pos.y, pos.x,pos.y) ;	    
	    }
	    old_pos = pos.copy()

	} 
    }

    
    let params = {
	'iterations' : 10000,
        'iterationsMin' : 0,
        'iterationsMax' : 100000,
        'iterationsStep' : 50 , 
	'dot_sz'     : 4, 
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

    p.setup = async function() {
	p.createCanvas(M,M, p.WEBGL)  ;
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

export function ABWidget()  {
    if (!server_render()) { 
        useEffect( async ()=> {
            console.log("AB loaded") ;
	    /*
	      dynamically load p5js 
	    */
	    let v = await loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" , ()=>{console.log("Explorer requested p5")}) ; 
	    let timedOut = await wait_until( ()=> window.p5  , 10000, 100) ;
	    if (timedOut) { log("timedout") } else { log("Detected p5")  } ;
	    await wait_until( ()=> window.p5, 10000, 100) ;	    	    
	    if (!server_render()) { 
		window.ep = new window.p5(Sketch, window.document.getElementById('MainContainer'));
	    } 
	})
    }
    return ( <div id="MainContainer" className={styles.full_height_flex}>   </div> ) 
}












