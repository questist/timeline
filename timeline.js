var canvasHeight = null
var canvasWidth = null
class Timeline {

    constructor(idOfCanvas,idOfiFrame) {
        //Properties
        this.goalElements = []
        this.goalLabels = []
        this.lastElementY = 0
        this.height = "100vh"
        this.midpoint = 0
        this.initialized = false
        this.ctx = null
        this.idOfContainer = idOfiFrame
        this.idOfCanvas = idOfCanvas
        this.color = "#707070"
        this.arrowHeight = 12.86
        this.arrowWidth = 15
        //goal element properties
        this.heightOfGoalEl = 50
        this.spaceBetweenGoalEl = 5
        this.spaceBetweenLabels = 15
        this.paddingForEndLabels = 50
        this.goalElWidth = 146
        this.goalElHeight = 50

        //set midpoint to frames width - scrollbar
        canvasWidth = document.getElementById(idOfiFrame).offsetWidth - 10
        this.midpoint = canvasWidth/2
        //console.log(canvas.offsetWidth)
        //TODO: css width is not the same as the width of the container retrieved with offsetWidth use getAttr
        
    }
    
    resetCanvas() {
        document.getElementById(this.idOfCanvas).remove()
    }
    
    drawTimeline() {
        //start drawing canvas and timeline
        //TODO: Might not need .height variable anymore
        
        var height = document.getElementById(this.idOfContainer).offsetHeight
        var canvas = null
        
        if(height > this.lastElementY) {
            canvasHeight = height - 8
            this.height = height - 8
        }
        else {
            canvasHeight = this.lastElementY + this.paddingForEndLabels
            this.height = this.lastElementY + this.paddingForEndLabels
        }

        canvas = document.createElement("canvas",{is: "timeline-canvas"})
        canvas.setAttribute("id",this.idOfCanvas)
        document.getElementById(this.idOfContainer).appendChild(canvas)
        
        this.ctx = canvas.getContext("2d")
        
        
        this.ctx.strokeStyle = this.color
        this.ctx.moveTo(this.midpoint,2) //set starting point for timeline
        this.ctx.lineTo(this.midpoint,this.height - 2) //move to end of line
        this.ctx.stroke()
        this.initialized = true
        this.drawArrows("top-arrow","bottom-arrow")
    }
    drawTodayCircle(top) {
        if(!this.initialized) {
            console.log("Timeline has not been initialized")
            return
        }

        var todayCircleCanvas = document.getElementById("today-circle")
        todayCircleCanvas.style.left = (this.midpoint - 10) + "px"
        todayCircleCanvas.style.top = top + "px"
        var ctx = todayCircleCanvas.getContext("2d")
        this.drawStubCircles(ctx)
    }
    drawArrows(topArrowCanvas,bottomArrowCanvas) {
        if(!this.initialized) {
            console.log("Timeline has not been initialized")
            return
        }
        var canvas = document.getElementById(topArrowCanvas);
        var ctx = canvas.getContext("2d")
        var container = document.getElementById(this.idOfContainer)

        //Get and move top arrow canvas into position at top of timeline
        canvas.style.left = (this.midpoint - this.arrowWidth/2 + 1) + "px"
        canvas.style.top =  "1px"

        //draw the top arrow
        ctx.fillStyle = this.color
        //draw top triangle
        ctx.beginPath()
        ctx.moveTo(this.arrowWidth/2,0)
        ctx.lineTo(this.arrowWidth, this.arrowHeight)
        ctx.lineTo(0, this.arrowHeight)
        ctx.lineTo(this.arrowWidth/2,0)
        
        ctx.fill()

       
        
        canvas = document.getElementById(bottomArrowCanvas)
        canvas.style.left = (this.midpoint - (this.arrowWidth/2) + 1) + "px"
        canvas.style.top = (container.offsetHeight - this.arrowHeight) + "px"
        ctx = canvas.getContext("2d")
        ctx.fillStyle = this.color
        //draw bottom triangle
        ctx.beginPath()
        ctx.moveTo(this.arrowWidth/2,this.arrowHeight)
        ctx.lineTo(this.arrowWidth, 0)
        ctx.lineTo(0,0)
        ctx.lineTo(this.arrowWidth/2, this.arrowHeight)
        
        ctx.fill()
    }

    positionEndLabels(top,bottom,topCircle,bottomCircle) {
        var topLabel = null
        var frame = null
        var topCircleCanvas = null
        var ctx = null
        var bottomCircleCanvas = null
        var bottomLabel = null

        topLabel = document.getElementById(top)
        topLabel.style.left = (this.midpoint - 25) + "px"
        topLabel.style.top = (this.paddingForEndLabels) + "px"

        frame = document.getElementById(this.idOfiFrame)
        
        bottomLabel = document.getElementById(bottom)
        bottomLabel.style.left = (this.midpoint - 25) + "px"
        bottomLabel.style.top = (frame.height - this.paddingForEndLabels - 18) + "px"

        topCircleCanvas = document.getElementById(topCircle)
        topCircleCanvas.style.left = (this.midpoint - 9) + "px"
        topCircleCanvas.style.top = Math.round(this.paddingForEndLabels / 2) + 1 + "px"
        ctx = topCircleCanvas.getContext("2d")
        this.drawStubCircles(ctx)

        bottomCircleCanvas = document.getElementById(bottomCircle)
        bottomCircleCanvas.style.left = (this.midpoint - 9) + "px"
        bottomCircleCanvas.style.top = height - Math.round(this.paddingForEndLabels / 2) - 21 + "px"
        ctx = bottomCircleCanvas.getContext("2d")
        this.drawStubCircles(ctx) 
    }

    drawStubCircles(ctx) {
        ctx.beginPath()
        ctx.arc(10,10,9,0,2*Math.PI)
        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = "white"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(10,10,5,0,2*Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    //date is either day or month depending on view
    addGoalElements(position, title = null, doubleDigitDate = null,itemType = null,goalType = null) {
        
        //create node
        var el = document.createElement("div")
        var goalEl = document.createElement("div")
        var left = 0
        var textNode = null
        var row = Math.floor(position / 2) + 1
        var date = this.goalLabels[this.goalLabels.length - 1].digit + "." + doubleDigitDate + ".YYYY"
        //add padding for first element
        
        if(row == 1 && this.goalLabels.length === 0) {
            this.lastElementY = this.paddingForEndLabels
        }
        
        
        
        //set container class
        el.classList = "goal-element-container"
        el.setAttribute("id","goal-el-container-" + position)
        
        //is right side or left side
        left = position % 2 === 0 ? true : false;

        //add element if it there is title and day are passed in
        if(title !== null && date !== null) {
            goalEl.classList = "goal-element"
            goalEl.setAttribute("id","goal-el-" + (this.goalElements.length + 1))
            goalEl.setAttribute("draggable",true)
            
            if(itemType !== null) {
                goalEl.classList.toggle(itemType)
            }
            if(goalType !== null) {
                goalEl.classList.toggle(goalType)
            }
            textNode = document.createTextNode(title)
            goalEl.appendChild(textNode)
            textNode = document.createElement("br")
            goalEl.appendChild(textNode)
            textNode = document.createTextNode(date)
            goalEl.appendChild(textNode)
        
            el.appendChild(goalEl)

            //add to array of goal elements
            // { position, left/right, date, id }
            this.goalElements.push({
                position: row,
                left: left,
                date: date,
                id: this.goalElements.length + 1
            })
        }

        //set the position on either side of the timeline
        //position = this.goalElements.length
        //position = Math.floor(position / 2)

        
        if(left) {
            el.style.left = this.midpoint - this.goalElWidth - 22.5 + "px"
            el.style.top = this.lastElementY + "px"
        }
        else {
            el.style.left = this.midpoint + 22.5 + "px"
            el.style.top = this.lastElementY + "px"
        }

        document.getElementById(this.idOfContainer).appendChild(el)
        
        //add event listeners for drag and drop once inserted in DOM
        el = document.getElementById("goal-el-container-" + position)
        
        el.addEventListener("drop",drop)
        el.addEventListener("dragover",allowDrop)
        if(title !== null) {
            goalEl = document.getElementById("goal-el-" + this.goalElements.length)
            goalEl.addEventListener("dragstart",drag)
        }
        //set lastElementY to the starting position of the next element
        //must make sure to call them in position orders 0, 1, 2
        if(left === false) {
            this.lastElementY = this.lastElementY + this.goalElHeight + 5
        }
    }

    //TODO FIX JULY - 1 issue
    addLabels(label,digit) {
        var id = ""
        var el = null
        var textEl = null
        //add padding for first element
        if(this.goalLabels.length === 0) {
            this.lastElementY = this.paddingForEndLabels
        }
        id = "label" + (this.goalLabels.length + 1)
        el = document.createElement("div")
        el.classList = "label"
        el.setAttribute("id",id)
        var textEl = document.createTextNode(label)
        el.appendChild(textEl)
        el.style.left = this.midpoint - 25 + "px"
        el.style.top = (this.lastElementY + 5) + "px"
        document.getElementById(this.idOfContainer).appendChild(el)
        

        //set lastElementY to next position on row element
        
        this.lastElementY = this.lastElementY + 28

        //fill label Obj so that dates can be cross-referenced with it
        //{"label",digit,id,startContainer,endContainer}
        var labelObj = {
            id: id,
            label: label,
            digit: digit,
            startContainer: -1,
            endContainer: -1
        }
        
        this.goalLabels.push(labelObj)
    }

    drawConnections() {
        var linked = []
        var linkedToGel = []
        var found = []
        var gel = null
        var div = null
        var left = 0
        var top = 0
        var p = 0
        var date = ""
        var singleLineX = 0
        var multipleLineX1 = 0
        var multipleLineX2 = 0
        var dot = 0
        var lineEnd = 0
        var leftCheck = []
        var id = ""

        //fill linked array with elements that are linked
        for(var i = 0; i < this.goalElements.length; i++) {
            linkedToGel = null
            //check that this items date has not been added to linked yet
            date = this.goalElements[i].date
            left = this.goalElements[i].left
            found = linked.filter(function(el) {
                return el[0].date === date && left === el.left
            })
            //if the date has already been added continue next iteration
            if(found.length !== 0) {
                continue
            }
            //get all the elements in goalElements matching this date and on same side
            
            linkedToGel = this.goalElements.filter(function(el) {
                return date === el.date && left === el.left
            })
            //add only if there is more than the current element in linkedToGel
            if(linkedToGel.length > 1) {
                linked.push(linkedToGel)
            }
        }
        
        
        //draw elements with linked day
        for(var e = 0; e < linked.length; e++) {
            //check for error that occurs when the linked elements are not on the same side
            leftCheck = linked[e].filter(function(el) {
                return linked[e][0].left !== el.left
            })
            if(leftCheck.length !== 0) {
                console.log("Error, all linked elements must be on the same side")
                continue
            }
            //TODO: need to add check that they are all together

            //draw the linked items, the goal Elements need to be in order from top to bottom
            for(var z = 0; z < linked[e].length; z++) {
                gel = linked[e][z]
                div = document.getElementById("goal-el-" + gel.id).parentNode
                left = div.style.left
                top = div.style.top
                p = left.indexOf("p")
                left = left.slice(0,p)
                p = top.indexOf("p")
                top = top.slice(0,p)
                top = new Number(top)
                left = new Number(left)
                

                //fill needed variables depending on left or right
                if(gel.left) {
                    singleLineX = this.midpoint - 10
                    multipleLineX1 = left + this.goalElWidth
                    multipleLineX2 = left + this.goalElWidth + 13
                }
                else {
                    singleLineX = this.midpoint + 10
                    multipleLineX1 = left
                    multipleLineX2 = left - 13
                }
                if(z === 0) {
                    //draw line from left
                    this.ctx.beginPath()
                    dot = top + 
                    Math.floor(((linked[e].length*this.goalElHeight) + 
                        ((linked[e].length - 1) * this.spaceBetweenGoalEl))/2)
                    
                    top = top + Math.floor(this.goalElHeight/2)
                   
                    this.ctx.moveTo(this.midpoint, dot)
                    this.ctx.lineTo(singleLineX, dot)
                    this.ctx.strokeStyle = this.color 
                    this.ctx.stroke()
                    //draw line from right
                    this.ctx.moveTo(multipleLineX1,top)
                    this.ctx.lineTo(multipleLineX2, top)
                    this.ctx.strokeStyle = this.color
                    this.ctx.stroke()

                    //draw the full line down since this is the top element
                    lineEnd = top + 
                        Math.floor((linked[e].length - 1) * this.goalElHeight + 
                            this.spaceBetweenGoalEl*(linked[e].length-1))
                    this.ctx.beginPath()
                    this.ctx.moveTo(multipleLineX2, top)
                    this.ctx.lineTo(multipleLineX2, lineEnd)
                    this.strokeStyle = this.color
                    this.ctx.stroke()

                    //draw arc
                    
                    this.ctx.beginPath()
                    this.ctx.arc(this.midpoint,dot,5,0,2*Math.PI)
                    this.ctx.fillStyle = this.color
                    this.ctx.fill()
                }
                //draw line from element to vertical line since it isn't the first one of linked elements
                else {

                    this.ctx.beginPath()
                    top = top + Math.floor(this.goalElHeight/2)
                    
                    this.ctx.moveTo(multipleLineX1,top)
                    this.ctx.lineTo(multipleLineX2, top)
                    this.ctx.strokeStyle = this.color
                    this.ctx.stroke()
                }
            }
        }

        //draw all the goal elements which don't have a linked day
        for(i = 0; i < this.goalElements.length; i++) {
            //check that the gel wasn't drawn yet by being linked
            id = this.goalElements[i].id
            found = linked.filter(function(e) {
                return e.filter(function(el) {
                    return el.id === id
                }).length !== 0 
            })
            if(found.length !== 0) {
                continue
            }
            gel = this.goalElements[i]
            div = document.getElementById("goal-el-" + gel.id).parentNode
            left = div.style.left
            top = div.style.top
            p = left.indexOf("p")
            left = left.slice(0,p)
            p = top.indexOf("p")
            top = top.slice(0,p)
            top = new Number(top)
            left = new Number(left)
            
            if(gel.left) {
                //var canvas = document.getElementById(this.idOfCanvas)
                //var ctx = canvas.getContext("2d")
                this.ctx.beginPath()
                top = top + Math.floor(this.goalElHeight/2)
                this.ctx.moveTo(left + this.goalElWidth, top)
                this.ctx.lineTo(this.midpoint,top)
                this.ctx.strokeStyle = this.color
                this.ctx.stroke()

                this.ctx.beginPath()
                this.ctx.arc(this.midpoint,top,5,0,2*Math.PI)
                this.ctx.fillStyle = this.color
                this.ctx.fill()
            }
            else {
                this.ctx.beginPath()
                top = top + Math.floor(this.goalElHeight/2)
                this.ctx.moveTo(this.midpoint, top)
                this.ctx.lineTo(left,top)
                this.ctx.strokeStyle = this.color
                this.ctx.stroke()

                this.ctx.beginPath()
                this.ctx.arc(this.midpoint,top,5,0,2*Math.PI)
                this.ctx.fillStyle = this.color
                this.ctx.fill()
            }
        }
    }
}

class TimelineCanvas extends HTMLCanvasElement {
    constructor() {
        super();

        this.width = canvasWidth
        this.height = canvasHeight
    }
}

customElements.define('timeline-canvas', TimelineCanvas, { extends: "canvas" })