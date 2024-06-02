
const inputs = document.querySelectorAll(".contact-input")
const toggleBtn = document.querySelector(".theme-toggle")
const allElements = document.querySelectorAll("*")

toggleBtn.addEventListener("click", () => {
	document.body.classList.toggle("dark");
	allElements.forEach(el => {
		el.classList.add("transition")
		setTimeout(() => {
			el.classList.remove("transition")
		}, 1000)
	})
})

inputs.forEach(ipt => {
	ipt.addEventListener("focus",() => {
		ipt.parentNode.classList.add("focus")
		ipt.parentNode.classList.add("not-empty")

	})
	ipt.addEventListener("blur",() => {
		if(ipt.value == ""){
			ipt.parentNode.classList.remove("not-empty")
		}
		ipt.parentNode.classList.remove("focus")
	})
})


window.addEventListener('scroll', e => {
	document.body.style.cssText += `--scrollTop: ${this.scrollY}px`
})


function removeFromArray(arr,elt) {
	for (let i = arr.length-1; i >= 0; i--){
		if(arr[i] == elt){
			arr.splice(i,1)
		}
	}
}

function heuristic(a, b) {   //матхэканская
	//let d = dist(a.i, a.j, b.i, b.j)
	let d = abs(a.i - b.i) + abs(a.j - b.j) // first()сколько клеточек от столба (текущей точки), до столбца (конечной точки) 
														// second() сколько клеточек от строки(текущей точки) до строки(конечной точки)
	return d
}

let intCol = document.querySelector("#int_col")
let intRow = document.querySelector("#int_row")
let intStart = document.querySelector("#int_start")
let intEnd = document.querySelector("#int_end")
let btnRestart = document.querySelector("#btn_restart")
let btnCreate = document.querySelector("#btn_create")
let btnCalc = document.querySelector("#btn_calkulate")

let cols 
let rows 

let holst = document.querySelector("#canva")
let width = holst.clientWidth
let height = holst.clientHeight


let openSet = new Array()
let closedSet = new Array()
let grid
let start
let end
let w, h
let path = new Array()
let notSolution = false 
let CAN = false
let CAN_DRAW = false
let current


btnCreate.addEventListener("click", () =>{
	cols = +intCol.value
	rows = +intRow.value
	width = holst.clientWidth
	height = holst.clientHeight
	grid = new Array(cols)
	w = width / cols
	h = height / rows
	
	for (let i = 0; i < cols; i++){
		grid[i] = new Array(rows)
	}
	for (let i = 0; i < cols; i++){
		for (let j = 0 ; j < rows; j++){
			grid[i][j] = new Spot(i,j);
		}
	}
	for (let i = 0; i < cols; i++){
		for (let j = 0 ; j < rows; j++){
			grid[i][j].addNeighbors(grid)
		}
	}
	CAN_DRAW = true
	setup()
	redraw()
})

btnRestart.addEventListener("click", () => {
	CAN = false;
   CAN_DRAW = false;
   path = new Array();
   closedSet = new Array();
   openSet = new Array();
	
   start = undefined;
   end = undefined;
	current = undefined

   resizeCanvas(w,h);
    
})


btnCalc.addEventListener("click", () =>{
	start = grid[0][0]
	openSet.push(start)
	end = grid[cols -1][rows-1]
	start.wall = false
	end.wall = false
	CAN = true

	setup()
	loop()
})




function Spot(i,j) {
	this.i = i
	this.j = j
	this.f = 0
	this.g = 0 //цена шага
	this.h = 0 // эвристика игнорим все препятствия и ищем кратчайший путь на пролом(мы же знаем где точка end)
	this.neighbors = []
	this.previous = undefined
	this.wall = false

	if (random(1) < 0.3){
		this.wall = true
	}

	this.show = function(color) {
		fill(color)
		if (this.wall){
			fill(0)
		}
		noStroke()
		rect(this.i*w, this.j*h, w-1,h-1)
	}

	this.addNeighbors = function(grid) {
		let i = this.i
		let j = this.j
		if(i < cols-1){
			this.neighbors.push(grid[ i + 1][j])
		}
		if(i > 0){
			this.neighbors.push(grid[ i - 1][j])
		}
		if(j < rows-1){
			this.neighbors.push(grid[i][ j + 1])
		}
		if(j > 0) {
			this.neighbors.push(grid[i][j - 1])
		}
		if (i > 0 && j > 0){
			this.neighbors.push(grid[i - 1][j - 1])
		}
		if (i < cols - 1  && j > 0){
			this.neighbors.push(grid[i + 1][j - 1])
		}
		if (i > 0 && j < rows -1) {
			this.neighbors.push(grid[i - 1][j + 1])
		}
		if (i < cols - 1 && j < rows -1) {
			this.neighbors.push(grid[i + 1][j + 1])
		}

		
	}


}
function setup() {
	let myCanvas = createCanvas(width,height)
	myCanvas.parent(holst)
}
function draw() {
	
	
	
	if(CAN_DRAW){
		background(0)
		for (let i = 0; i < cols; i++){
			for (let j = 0; j < rows; j++){
				grid[i][j].show(color(255))
			}
		}
	}
	if (CAN){
		
		
		

	if (openSet.length > 0){
		
		
	
		let winner = 0
		for (let i = 0; i < openSet.length; i++){
			if (openSet[i].f < openSet[winner].f){
				winner = i
			}
		}
		current = openSet[winner] 
		if (current === end ){
			console.log('DONE!');
			noLoop()
		}
		removeFromArray(openSet,current)
		closedSet.push(current)

		let neighbors = current.neighbors
		
		
		for (let i = 0; i < neighbors.length; i++){
			let neighbor = neighbors[i]

			if(!closedSet.includes(neighbor) && !neighbor.wall){
				let tempG = current.g + 1 
				let newPath = false
				if (openSet.includes(neighbor)){
					if(tempG < neighbor.g){
						neighbor.g = tempG
						newPath = true
					}
				} else {
					neighbor.g = tempG
					newPath = true
					openSet.push(neighbor)
				}

				if(newPath) {
					neighbor.h = heuristic(neighbor, end)
					neighbor.f = neighbor.h + neighbor.g
					neighbor.previous = current
				}
				

			}
		}
	} else {
		// нет решения
		console.log('NO SOLUTION');
		noLoop()
		return
	}

	
	for (let i = 0; i < closedSet.length; i++){
		closedSet[i].show(color(255,0,0))
	}
	
	for (let i = 0; i < openSet.length; i++){
		openSet[i].show(color(0,255,0))  
	}
	console.log('temp');
	// найти правильный путь
	path = []
	let temp = current
	path.push(temp)

	while(temp.previous){
		path.push(temp.previous)
		temp = temp.previous
	}	
	

	for (let i = 0; i < path.length; i++){
		path[i].show(color(0,0,255))
	}
	
	}
}


