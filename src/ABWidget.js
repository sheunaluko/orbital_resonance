import {useEffect} from 'react' ; 

import styles from '../styles/Explorer.module.css'

import * as abu from './art_blocks_utils.js' ; 

import {
    Link ,
    Marquee,
    loadScript,
    animateCSS,
    server_render ,
    wait_until ,
    Logger ,
    wait,
    ArrowBack
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

//define the params object
var params = {
    'Radius' : 0.8,
    'Velocity' : 0.5,
    'OrbiterSize'     : 4,
    'SunSize'  : 4 ,
    'CoarseGravity'  : 2,
    'FineGravity'  : 0 ,
    'PreciseGravity'  : 0 ,
    'Path'      : false,
    'Time' : 10000,
} 

// define the sketch 
var Sketch = function(p) {
    
    var RENDER_DIM = 2400;
    var WIDTH = window.innerWidth;var HEIGHT = window.innerHeight;
    //var DIM = Math.round(0.95*Math.min(WIDTH, HEIGHT));
    var DIM = 0.95*Math.min(WIDTH, HEIGHT) ; 
    var M = DIM / RENDER_DIM;

    let get_drawer = function(params) {
	//generates all points using the same RENDER_DIM 
	let {CoarseGravity : _acc, FineGravity : acc_fine, PreciseGravity :acc_ultra_fine,Radius,Velocity : v_start}  =  params ;
	let a_tot =  _acc + acc_fine  + acc_ultra_fine
	let x_init = (Radius/2)*RENDER_DIM ; //R in pixels
	let v_circular = Math.sqrt(a_tot*x_init) //Circular velocity 
	let v_init = v_circular * v_start
	let dt = 0.3 //params.dt; 
	let pos = p.createVector(x_init,0) ;  let vel = p.createVector(0,v_init) ;
	return function() {
	    let acc = p.createVector(0 - pos.x, 0 - pos.y);acc.mult(1/acc.mag());acc.mult(a_tot);
	    let dv  = window.p5.Vector.mult(acc,dt) 
	    vel.add(dv) //updates the velocity vector
	    let dp  = window.p5.Vector.mult(vel,dt) 
	    pos.add(dp);
	    return pos.copy() 	
	}
    }
    
    let get_points = function() {let dfn=get_drawer(params);let pts=[];for(var i=0;i<params.Time;i++){let pt = dfn(); if((i% 3) == 0){pts.push(pt)}};return pts}

    var transparency = 255; 
    
    let display_points = async function(pts,init_hash) {

	
	p.fill(0); let old_pos = null;
        let n = -1 ; 
	for (var pos of pts) {

	    if ( hash(params) != init_hash )  {
		console.log("ENDING DRAW!")
		return 
	    } 
	    
	    //scale the pos 
	    pos.x = pos.x*M ; pos.y = pos.y*M ; 
            n += 1
	    
	    p.ellipse(0,0,params.SunSize)  ;
            p.push() ;
            p.noStroke() ; 
	    //add color here
	    transparency = transparency + 1 ;
	    
	    let c = p.color(153, 102, 255,transparency % 255)	    
            p.fill(0) ;	    	    
	    //--- 
	    p.ellipse(pos.x,pos.y , params.OrbiterSize)
            p.pop() ;
            
	    if (params.Path && old_pos) {
		p.line(old_pos.x,old_pos.y, pos.x,pos.y) ;	    
	    }
	    old_pos = pos.copy()

	    if (params.draw) {
		await wait(params.delay) ; 
	    } 
	} 
    }


    p.setup = async function() {
	p.createCanvas(DIM,DIM,p.WEBGL)  ;

    }

    //var last_param_str = null ;
    var hash = function(p) {
        return JSON.stringify(p)
    }

    var pphash = null  ;
    var p_rev  = 0 ; 

    p.draw = async function() {

        if (pphash == hash(params)) {
            return 
        }

        pphash = hash(params)
	
        console.log("Rendering new params!") 
        
        p.clear() 
	let pts = await get_points() ;
	let _   = await display_points(pts,pphash)

    } 
    
}

function generate() {
    //generates new parameters
    params = abu.get_params()
    console.log(params) 
} 

function Footer() {

    setTimeout ( function(){
	document.getElementById("footer").style.visibility = "" 
    }, 500)


    
    return (
	    <div
	    id="footer" 
	    style={{
		visibility : "hidden"
	    }}>
	    <button onClick={generate}>
	      g e n e r a t e 
	    </button> 
	    </div> 
    ) 
}

let _ArrowBack = ArrowBack("/")

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
    return (
	    <div style={{display: 'flex',
			flexDirection : 'column' ,
			 alignItems : 'center'}}>
	    <_ArrowBack /> 
	    <div id="MainContainer" className={styles.full_height_flex}>
	    </div>
	    <Footer /> 	    
	 </div> 
    )
}












