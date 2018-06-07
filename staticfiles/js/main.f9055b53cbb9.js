console.log('success2')
var sidebar = document.getElementsByClassName("nav-sidebar")
setTimeout(sidebarActive, 2000)

function sidebarActive() {
    sidebar[0].classList.add('nav-sidebar-is-active')
}
