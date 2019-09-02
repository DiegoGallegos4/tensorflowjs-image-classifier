import * as mobilenet from '@tensorflow-models/mobilenet'

/**
 * Given an image element and a url checks if url is valid and sets the src to display 
 * the given url resource.
 * @param {HTMLElement} image 
 * @param {String} imgURL 
 * @param {HTMLElement} btn 
 */
const displayImage = (image, imgURL, btn) => {
    if (isURLValid(imgURL)) {
        image.src = imgURL
        image.crossOrigin = "anonymous";
        btn.classList.add('is-loading')
    }
}

const addCellToRow = (row, value) => {
    const cellElement = document.createElement('td')
    cellElement.innerText = value
    row.appendChild(cellElement)
}

/**
 * Display the probabilities returned by image prediction
 * @param {Object[]} classes
 * @param {string} classes[].className 
 * @param {number} classes[].probability 
 */
const displayClasses = classes => {
    const table = document.getElementById('classes-table')
    table.innerHTML = ''

    for (let i = 0; i < classes.length; i++) {
        const row = document.createElement('tr')

        const vals = [classes[i].className, classes[i].probability.toFixed(4)]
        vals.forEach(elt => addCellToRow(row, elt))

        table.appendChild(row)
    }
}


// https://i.imgur.com/YPx3pRi.jpg
/**
 * Loads mobilenet and classifies the given image.
 * @param {TensorflowModel} network 
 * @param {HTMLElement} image 
 */
const predict = async (network, image) => {
    const results = await network.classify(image)
    displayClasses(results)
    status('Image predicted.')
}

/**
 * Load model asynchronously
 * @param {TensorflowModel} network 
 * @param {HTMLElement} image 
 */
const loadModel = async (image, btn) => {
    status('Loading model')
    const network = await mobilenet.load()
    status('Model loaded.')
    btn.addEventListener('click', e => predict(network, image))
}

/**
 * Get all DOM elements and set the appropiate event listeners for them
 */
const app = async () => {
    const image = document.getElementById("image-to-classify")
    const imageInput = document.querySelector('input[name="url"]')
    const loadBtn = document.getElementById('load-model')
    loadBtn.setAttribute('disabled', '')

    // Event Listeners
    image.addEventListener('error', e => {
        status("Invalid Image")
        loadBtn.setAttribute('disabled', '')
        loadBtn.classList.remove('is-loading')
    })

    image.addEventListener('load', e => {
        status("Image Loaded")
        loadBtn.removeAttribute('disabled')
        loadBtn.classList.remove('is-loading')
    })

    imageInput.addEventListener("change", e => displayImage(image, imageInput.value, loadBtn))

    // Load model asynchronously
    loadModel(image, loadBtn)
}


// Helper functions
const status = msg => document.getElementById('status').innerText = msg
const isURLValid = url => true

// start app
app()