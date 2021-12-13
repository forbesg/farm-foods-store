export default function fixBody(fix) {
  // Get the scroll position before setting positioning to fixed to prevent
  // jump to top of page
  const { top } = document.body.getBoundingClientRect()
  if (fix) {
    document.body.setAttribute('style', `top: ${top}px`)
    document.body.classList.add('fixed')

    return
  }
  document.body.classList.remove('fixed')
  // document.body.removeAttribute('style')
  window.scrollTo({ top: top * -1 })
}
