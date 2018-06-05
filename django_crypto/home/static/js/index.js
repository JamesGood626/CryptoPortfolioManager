window.onload = function() {
  var sidebar = document.getElementById("sidebar")
  var burger = document.getElementById("burger")
  var leftBurger = document.getElementById("left-burger")
  var rightBurger = document.getElementById("right-burger")

  burger.addEventListener('click', toggleSidebar)

  function toggleSidebar() {
      if (!sidebar.classList.contains('nav-sidebar-is-active')){
          animateBurgerToX()
          removeClass(sidebar, 'nav-sidebar-hide')
          addClass(sidebar, 'nav-sidebar-is-active')
      } else {
          animateBurgerToFlat()
          removeClass(sidebar, 'nav-sidebar-is-active')
          setTimeout(delayedAddClass, 700)
      }
  }

  function removeClass(el, className) {
      el.classList.remove(className)
  }

  function addClass(el, className) {
      el.classList.add(className)
  }

  function delayedAddClass() {
      if (!sidebar.classList.contains('nav-sidebar-is-active')) {
          addClass(sidebar, 'nav-sidebar-hide')
      }
  }

  var tlX = new TimelineLite()
  TweenLite.set(leftBurger, {transformOrigin:'center'})
  TweenLite.set(rightBurger, {transformOrigin:'center'})
  tlX.to(leftBurger, 0.25, {y:"16.67px"})
  tlX.to(rightBurger, 0.25, {y:"-16.67px"}, "-=0.25")
  tlX.to(leftBurger, 0.25, {rotation:"-45deg"})
  tlX.to(rightBurger, 0.25, {rotation:"45deg"}, "-=0.25")
  tlX.pause()

  function animateBurgerToX() {
      tlX.play()
  }
  function animateBurgerToFlat() {
      tlX.reverse()
  }
}
