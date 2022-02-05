import { mapDomElements } from "./DOMConnection.js"

class TimeCounter{
    constructor(){
        this.inputElements = {}
        this.initialize()

        this.maxSeconds = 60
        this.maxMinutes = 60
        this.maxHours = 100

        this.currentTime = 0
        this.initialTime = 0
        this.elapsedTime = 0

        this.timeInterval = null
        this.buttoKey = null

        this.startValue = 0
        this.progressVal = 0
        this.currentValue = 0

        this.maxTime = (this.maxHours - 1)*3600 + (this.maxMinutes - 1)*60 + this.maxSeconds - 1
    }

    initialize = () => {
        this.createDomElemt()
    }

//connection with DOM elements
    createDomElemt = () => {
        const listOfIds = Array.from(document.querySelectorAll('[class="inputs"] [id]')).map(elem => elem.id)
        this.inputElements = mapDomElements(listOfIds, 'id')

        this.playBtn = document.querySelector(".fa-play-circle")
        this.pauseBtn = document.querySelector(".fa-pause-circle")
        this.stopBtn = document.querySelector(".fa-stop-circle")

        this.colons = document.querySelectorAll(".colon")
        this.alarm = document.querySelector(".alarm")
        this.audio = document.querySelector("audio")
        this.progressCircle= document.querySelector(".circular-progress")

        this.setupListeners()
    }

//addEventListeners function added for inputs and buttons
    setupListeners = () => {
        Object.keys(this.inputElements).forEach(input => {
            this.inputElements[input].addEventListener("keydown", this.getTimerValue)
        })

        this.playBtn.addEventListener("click", this.start)
        this.pauseBtn.addEventListener("click",this.pause)
        this.stopBtn.addEventListener("click",this.stop)
    }

//getting timer values from inputs and comparing with the maxTime
    getTimerValue = () => {
        if(event.key === "Enter"){
            this.hoursValue = parseInt(this.inputElements.hours.value, 10)
            this.minutesValue = parseInt(this.inputElements.minutes.value, 10)
            this.secondsValue = parseInt(this.inputElements.seconds.value, 10)

            if(this.hoursValue > this.maxHours){
                alert("Podaj godzinę poniżej 99")
            }

            this.timeSum = this.secondsValue + this.minutesValue*60 + this.hoursValue*3600
            this.totalTime = this.timeSum <= this.maxTime ? this.timeSum : this.maxTime
            this.currentTime = this.totalTime

            this.calculateTime()
        }
    }

//calculating function of inputs values inserted into correct hh:mm:ss format
    calculateTime = () => {
        this.seconds = `0${this.currentTime%this.maxSeconds}`
        this.minutes = `0${Math.floor(this.currentTime/60)%this.maxMinutes}`
        this.hours = `0${Math.floor(this.currentTime/3600)%this.maxHours}`

        this.setTimeValue(this.hours, this.minutes, this.seconds)
    }

//display function of calculated input vale into right time format
    setTimeValue = (hours, minutes, seconds) => {
        this.inputElements.seconds.value = seconds.slice(-2)
        this.inputElements.minutes.value = minutes.slice(-2)
        this.inputElements.hours.value = hours.slice(-2)
    }

//display function of calculated time value during countdown
    countedTime = (time) => {
        this.seconds = `0${time%this.maxSeconds}`
        this.minutes = `0${Math.floor(time/60)%this.maxMinutes}`
        this.hours = `0${Math.floor(time/3600)%this.maxHours}`

        this.inputElements.seconds.value = this.seconds.slice(-2)
        this.inputElements.minutes.value = this.minutes.slice(-2)
        this.inputElements.hours.value = this.hours.slice(-2)
    }

//function of changing icon on play/pause button
    showButton = (buttonKey) => {
        this.buttonToShow = buttonKey === "PLAY" ? this.playBtn : this.pauseBtn
        this.buttonToHide = buttonKey === "PLAY" ? this.pauseBtn : this.playBtn

        this.buttonToShow.style.display = "block"
        this.buttonToHide.style.display = "none"
    }

//reset time value function
    resetTime = () => {
        this.inputElements.seconds.value = "00"
        this.inputElements.minutes.value = "00"
        this.inputElements.hours.value = "00"
        this.currentTime = 0
        this.elapsedTime = 0
        this.initialTime = 0

        this.colons.forEach(colon => colon.classList.remove("animated"))
    }

//start of time countdown function
    start = () => {
        if(this.currentTime === 0){
            return
        }
        else if(this.currentTime === this.elapsedTime){
            this.startValue = this.currentValue
        }
        else{
            this.initialTime = this.currentTime
            this.elapsedTime = this.initialTime--
            this.countedTime(this.elapsedTime)
        }

        this.timeInterval = setInterval(() => {
            this.elapsedTime = this.initialTime--
            this.countedTime(this.elapsedTime)
            this.progress()

            if(this.elapsedTime <= 0){
                clearInterval(this.timeInterval)
                Object.keys(this.inputElements).forEach(input => {
                    this.inputElements[input].classList.add('finish')
                })

                this.alarm.style.opacity = "1"
                this.audio.play()
                this.showButton("PLAY")
                this.resetTime()
            }
        }, 1000)

        this.colons.forEach(colon => colon.classList.add("animated"))

        this.showButton("PAUSE")
    }


//pause of countdown function
    pause = () => {
        this.currentTime = this.elapsedTime
        this.currentValue = this.startValue

        clearInterval(this.timeInterval)

        this.colons.forEach(colon => colon.classList.remove('animated'))

        this.showButton("PLAY")
    }

//stop of countdown function
    stop = () => {
        clearInterval(this.timeInterval)
        this.colons.forEach(colon => colon.classList.remove('animated'))

        this.alarm.style.opacity = "0"
        this.audio.pause()

        this.resetTime()
        this.progress()
        this.showButton("PLAY")
    }

//progress circle function
    progress = () => {
        if(this.currentTime === 0){
            this.startValue = 0
            this.progressVal = 100
            Object.keys(this.inputElements).forEach(input => {
                this.inputElements[input].classList.remove('finish')
            })
        }
        else{
            this.progressVal = (100/this.currentTime)
            this.startValue += this.progressVal
        }

        this.progressCircle.style.background = `conic-gradient(rgb(5, 5, 69) ${this.startValue * 3.6}deg, rgb(136, 185, 248) ${this.startValue * 3.6}deg)`
    }
}

document.addEventListener("DOMContentLoaded", new TimeCounter())