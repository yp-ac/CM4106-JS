import generateData from "./dataGenerator.js";
import getSorter from "./sorting.js";
import initChart from "./visualization.js";

function mapRange(value, fromMin, fromMax, toMin, toMax) {
    // Ensure the value is within the "from" range.
    const clampedValue = Math.min(Math.max(value, fromMin), fromMax);
    
    // Map the clamped value to the "to" range.
    const mappedValue = ((clampedValue - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
    
    return mappedValue;
}

const parent = document.querySelector("main.container")
let container = d3.select("#viz-area")

const props = {
    min: 0,
    max: 100,
    height: Math.round(window.innerHeight / 2),
    width: parent.offsetWidth,
    duration: Number(localStorage.getItem('duration')) || 250,
    colors: {
        primary: getComputedStyle(parent).getPropertyValue('--primary'),
        secondary: '#fcd34d',
        tertiary: '#ef4444', 
        completed: '#22c55e' 
    }
}

props.data = generateData(Number(localStorage.getItem('size')) || 20, props.min + 10, props.max)

container.attr('viewBox', [0, 0, props.width, props.height])

let animationRunning = false

const speedSelector = document.getElementById("speed")
const sizeSelector = document.getElementById('size')
const algorithmSelector = document.getElementById('algorithm')
const mainBtn = document.getElementById('main-btn')

speedSelector.value = localStorage.getItem('speed-cnt') || 50
document.getElementById("speed-op").innerText = `${Math.round(props.duration)} ms/step`
sizeSelector.value = props.data.length

let sorter = getSorter(algorithmSelector.value) // by default get bubble sort
let updateChart = initChart(container, props)

speedSelector.addEventListener('input', function() {
    props.duration = mapRange(Number(this.value), 0, 100, 500, 10)

    document.getElementById('speed-op').innerText = `${Math.round(props.duration)} ms/step`
    localStorage.setItem('speed-cnt', this.value)
    localStorage.setItem('duration', props.duration)
})

sizeSelector.addEventListener('input', function() {
    container.selectAll('rect')
             .remove()

    localStorage.setItem('size', this.value)
    props.data = generateData(this.value, props.min + 10, props.max)
    updateChart = initChart(container, props)
})

algorithmSelector.addEventListener('input', function() {
    sorter = getSorter(this.value)
})

mainBtn.addEventListener('click', function() {
    mainBtn.classList.toggle('outline')
    animationRunning = !animationRunning

    mainBtn.innerText = animationRunning ? 'Stop' : 'Start'
    
    setTimeout(async () => {
        for (let op of sorter(props)) {
            if (!animationRunning) {
                props.data.map(d => {if (d.color != 0) container.color = 0})
                console.log("is this triggered?")
                break;
            }

            await updateChart(props)
            
            op.j.map((j) => props.data[j].color = 0)

            if (op.resetColor)
            props.data.map(d => {if (d.color != 0) container.color = 0})
        }
        animationRunning = false
        mainBtn.innerText = animationRunning ? 'Stop' : 'Start'
        mainBtn.classList.remove('outline')
    }, 0)
})
