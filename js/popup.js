
document.addEventListener("DOMContentLoaded", function () {
  main();
});

function main() {
  let toggleActiveExtension = true;
  const switchBtnEl = document.querySelector("#switch-btn")

  function activateToggleBt(switchBtnEl) {
    switchBtnEl.setAttribute("aria-pressed", "true")
    if (!switchBtnEl.classList.contains("active")) {
      switchBtnEl.classList.add("active")
    }
  }

  function deactivateToggleBt(switchBtnEl) {
    switchBtnEl.setAttribute("aria-pressed", "false")
    if (switchBtnEl.classList.contains("active")) {
      switchBtnEl.classList.remove("active")
    }
  }
  function changeExtensionActiveState() {
    if (toggleActiveExtension) {
      activateToggleBt(switchBtnEl)
      return
    }
    deactivateToggleBt(switchBtnEl)
  }

  chrome.storage.sync.get([
    'toggleActiveExtension'
  ], (result) => {
    toggleActiveExtension = result.toggleActiveExtension;
    // Needed only once on script load. After this, jQuery and
    // bootstrap will take over the change state. That's why
    // there's no changeExtensionActiveState() on the 'click'
    // event
    changeExtensionActiveState()
  });

  switchBtnEl.addEventListener('click', (ev) => {

    chrome.storage.sync.set({
      toggleActiveExtension: !toggleActiveExtension
    }, () => { }
    )
    // Close popup.html window. This allows the toggle button to
    // function as expected. If one doesn't close the window,
    // toggle btn doesnt trigger the chrome.storage.onChanged
    // event. Don't know why, but I already spent to much on this,
    // so... window.close()!
    window.close();
  })
}
