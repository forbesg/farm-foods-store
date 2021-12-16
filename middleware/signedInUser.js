export default function ({ redirect, route, store, isClient }) {
  if (process.server) {
    // eslint-disable-next-line
    console.log('server side')
    return
  }
  if (route.path === '/account' && !store.state.user) {
    return redirect('/login')
  }
  if (route.path === '/login' && store.state.user) {
    return redirect('/account')
  }
}
