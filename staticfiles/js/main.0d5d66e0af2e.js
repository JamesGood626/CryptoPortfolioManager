
  var sidebar = document.getElementById("sidebar")
  var burger = document.getElementById("burger")
  var leftBurger = document.getElementById("left-burger")
  var rightBurger = document.getElementById("right-burger")

  console.log("working")
  console.log(leftBurger)
  burger.addEventListener('click', toggleSidebar)

  function toggleSidebar() {
      if (!sidebar.classList.contains('nav-sidebar-is-active')){
          removeClass(sidebar, 'nav-sidebar-hide')
          addClass(sidebar, 'nav-sidebar-is-active')
      } else {
          removeClass(sidebar, 'nav-sidebar-is-active')
          setTimeout(delayedAddClass, 700)
      }
  }

  function removeClass(el, className) {
      el.classList.remove(className)
  }

  function addClass(el, className) {

      TweenLite.to(leftBurger, 2, {top:"125.56px"})
      el.classList.add(className)
  }

  function delayedAddClass() {
      if (!sidebar.classList.contains('nav-sidebar-is-active')) {
          addClass(sidebar, 'nav-sidebar-hide')
      }
  }
