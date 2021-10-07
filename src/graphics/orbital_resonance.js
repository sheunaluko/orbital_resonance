
/* 
   Main script for implementing the orbital drawings 
   @Copyright Sheun Aluko, 2021 - All Rights Reserved 
*/

import {
   getRNG 
}  from "./art_blocks_utils.js" ;

import {
    wait 
} from "../core_imports.js" 


window.getRNG = getRNG ; 

export function getRandomParams() {
    let  R = getRNG() ;  //random number generator    
    let params  = {
	'iterations' : R.random_num(2000, 10000) ,
	'dot_sz'     : R.random_num(0,6) , 
	'lines'      : R.random_bool(0.1) ,
	'center_sz'  : 4 ,
	'acc_scale'  : R.random_num(0.1,10) 
    }  ;
    return params 
}

export var  examples = ([
    '{"T":116.29999999999767,"dot_sz":3.5,"center_sz":4,"delta":0.1,"iterations":50000,"increment_rate_ms":1000}' , 

    '{"T":117.59999999999759,"dot_sz":3.5,"center_sz":4,"delta":0.1,"iterations":50000,"increment_rate_ms":1000}' , 

    '{"T":326.2000000000057,"dot_sz":4.75,"center_sz":4,"delta":0.1,"iterations":6000,"increment_rate_ms":40}' , 


    '{"T":348.60000000001077,"dot_sz":4.75,"center_sz":4,"delta":0.1,"iterations":6000,"increment_rate_ms":40}' , 

    '{"T":377.50000000001734,"dot_sz":4.75,"center_sz":4,"delta":0.1,"iterations":6000,"increment_rate_ms":40}' , 
]).map( JSON.parse )

export function get_static_drawer ( params) {

    let {acc_scale}  =  params ; 

    let createVector = (x,y) => {
	return new p5.Vector(x,y,0) 
    } 
    //set up persistent variables in this closure
    let static_scale = 0.45
    let x_start = params.x_start || Math.min(window.innerWidth*static_scale,window.innerHeight*static_scale)

    console.log("x_start:" + x_start) ;
    let pos = createVector(x_start,0) ;  let vel = createVector(0,4) ; 
    return function() {
	let acc = createVector(0 - pos.x, 0 - pos.y) ;
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

export function get_points(params) {
    let dfn = get_static_drawer(params) ; let pts = [] 
    for (var i=0; i < params.iterations ; i++) { pts.push(dfn()) } ; return pts ; 
}

export async function draw_points(p,pts, params) {
    
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

export function DrawRandom(p) {
    let params = getRandomParams() ; 
    draw_points( p, get_points(params) , params ); 
}

export function Main(p) {
    let points = get_points(examples[0])
    draw_points
} 



/*
 Creator selected ranges that result in most interesting (resonant) designs  
*/
let acc_ranges = [ [0,10.2] , [13.33, 17.5] , [22.758,33.62], [45.05,45.5],
		   [46.476, 99], [148.364,194.343 ] ] 
