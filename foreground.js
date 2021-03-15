
function main() {

  const cleanContainer = createCleanContainer()
  if (!cleanContainer) {
    return
  }
  // Get available hour list and group by hour
  const anchorList = document.querySelectorAll('div.row.horaris a')
  let foundSame = false;
  for (let i = 0; i < anchorList.length; i++) {
    const anchor = anchorList[i];
    // Loop forward from the current index against itself
    foundSame = false
    for (let j = i + 1; j < anchorList.length; j++) {
      const anchorAgainst = anchorList[j];

      // group by same hour
      if (anchor.innerHTML === anchorAgainst.innerHTML) {
        foundSame = true
        anchor.parentNode.insertBefore(anchorAgainst, anchor.nextSibling)
        cleanContainer.querySelector("div.row.horaris").appendChild(anchor.parentNode)
      }
    }
    if (!foundSame) {
      cleanContainer.querySelector("div.row.horaris").appendChild(anchor.parentNode)

    }

  }

  // Sort DOM elements
  // I'm lazy..thanks to https://stackoverflow.com/questions/282670/easiest-way-to-sort-dom-nodes
  const list = cleanContainer.querySelector('div.row.horaris');
  [...list.children]
    .sort((a, b) => a.innerText > b.innerText ? 1 : -1)
    .forEach(node => list.appendChild(node));


  // Hide the junk!
  const horariRow = document.querySelectorAll("div.horari_reserva_bootstrap")
  horariRow.forEach(e => e.setAttribute("style", "display:none"))

  // Show cleaned UI
  document.querySelector("#zonas").appendChild(cleanContainer)

  // Loop through cleaned UI
  const span = document.createElement("span")
  span.setAttribute("style", "color: black;position: absolute;z-index: 99;")
  cleanContainer.querySelectorAll("div.row.horaris > div.reservable").forEach(e => {
    // Stack them all but the last!
    e.querySelectorAll("a").forEach(ch => {
      ch.setAttribute("style", "position: absolute; width: calc(100% - 30px);")
    })
    // Set parent div initial height
    e.setAttribute("style", "height: 56px;")

    // Show counter
    const newSpan = span.cloneNode()
    newSpan.textContent = e.childElementCount
    e.prepend(newSpan)
  })
}

// Call script load
main()

// Listen for changes. There's an edge case where user can change how many hours
// can select with one reservation click and the action doesn't push new url to history,
// mainly because the btn triggers an AJAX call that retrieves the new data without reloading page
// I use this flag to prevent multiple useless executions triggered by DOMSubtreeModified event
// TODO: This is over engineered. Find other way
let flag = false
document.querySelector("#zonas").addEventListener('DOMSubtreeModified', (ev) => {
  if (flag) return

  // wait for AJAX response in a non blocking way
  setTimeout(() => {
    // block execution until AJAX response. Give it some time to not overflow stack
    do {
      setTimeout(() => { }, 50);
    } while (document.querySelector("div#loading").classList.contains("active"))

    main()
    flag = false
  }, 0);
  // Inmediatly set flag to prevent multiple calls from the event
  flag = true
})
function lek() {
  setTimeout(lek, 300);
}

/**
* @return Node with the following structure or @null if no div.horari_reserva_bootstrap
* <div class="horari_reserva_bootstrap">
*  <div class="row">
*    <div class="col-lg-12 col-md-12 col-12">
*      <h1>Horas</h1>
*    </div>
*  </div>
* <div class="row horaris"></div>
* </div>
*/
function createCleanContainer() {
  const getContainer = document.querySelector("div.horari_reserva_bootstrap")
  if (!getContainer) return null

  const container = getContainer.cloneNode()

  const row = document.createElement("div")
  row.classList.add("row")

  const headerContainer = document.createElement("div")
  headerContainer.classList.add("col-lg-12", "col-md-12", "col-12")

  const horasText = document.createElement("h1")
  horasText.appendChild(document.createTextNode("Horas"))
  headerContainer.appendChild(horasText)
  row.appendChild(headerContainer)
  container.appendChild(row)

  const rowHoraris = document.createElement("div")
  rowHoraris.classList.add("row", "horaris")
  container.appendChild(rowHoraris)

  return container
}