const main = document.querySelector("main.container")
const resultsList = main.querySelector("ul.list-group")
const showPagesLeftRight = 3
const resultsPerPage = 25
const paginationButtonsWidth = '3em'
const edgeButtonsWidth = '4em'
const url = (startIndex = 0, resultsPerPage = 20) =>
    `https://pokeapi.co/api/v2/pokemon?offset=${startIndex}&limit=${resultsPerPage}`

getData(url(0, resultsPerPage))

function getData(url) {
    fetch(url).then(resp => resp.json()).then(data => displayData(data)).catch(err => alert("Błąd", err))
}

function displayData(data) {
    const pages = Math.ceil(data.count / resultsPerPage)
    const previous = data.previous
    let currentPage
    if (previous) {
        currentPage = Math.floor(Number(previous.split("offset=")[1].split("&")[0]) / resultsPerPage) + 2
    } else {
        currentPage = 1
    }
    updateButtons(currentPage, pages)
    writeRows(data.results)
}

function updateButtons(currentPage, pages) {
    const oldNavigation = main.querySelector("div#pagination")
    oldNavigation?.parentElement.removeChild(oldNavigation)
    let navigation = document.createElement("div")
    navigation.id = "pagination"
    main.prepend(navigation)

    function createButton(text, id, width) {
        let button = document.createElement("button")
        button.classList.add("btn", "btn-primary", "m-2")
        button.style.width = width ?? ''
        button.textContent = text
        button.id = id
        navigation.appendChild(button)
        return button
    }

    function createDottedButton() {
        let dottedButton = createButton("...", '', paginationButtonsWidth)
        dottedButton.disabled = true
    }

    function createNormalButton(text, id, width) {
        let normalButton = createButton(text, id, width)
        normalButton.addEventListener("click", e => getData(e.target.id))
        return normalButton
    }

    createNormalButton('first', url(0, resultsPerPage), edgeButtonsWidth)

    const interval = 2 * showPagesLeftRight + 1
    let [start, stop] = [currentPage - showPagesLeftRight, currentPage + showPagesLeftRight]
    if (currentPage <= 1 + showPagesLeftRight) {
        [start, stop] = [1, 1 + interval]
    } else if (currentPage >= pages - showPagesLeftRight) {
        [start, stop] = [pages - interval, pages]
    }

    if (currentPage > 1 + showPagesLeftRight) {
        createDottedButton()
    }

    for (let i = start; i <= stop; i++) {
        const startIndex = (i - 1) * resultsPerPage
        let pageButton = createNormalButton(i, url(startIndex, resultsPerPage), paginationButtonsWidth)
        pageButton.disabled = i === currentPage
    }

    if (currentPage < pages - showPagesLeftRight) {
        createDottedButton()
    }

    const lastPageIndex = (pages - 1) * resultsPerPage
    createNormalButton('last', url(lastPageIndex, resultsPerPage), edgeButtonsWidth)
}

function writeRows(results) {
    let rows = resultsList.querySelectorAll("li")
    rows?.forEach(row => resultsList.removeChild(row))

    results.forEach(result => {
        let row = document.createElement("li")
        let idx = result.url.split("/").reverse()[1]
        row.textContent = `${idx} ${result.name}`
        resultsList.appendChild(row)
    })
}