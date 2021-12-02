export default function ({ redirect, route, store }) {
  if (route.path === '/account' && !store.state.user) {
    return redirect('/login')
  }
  if (route.path === '/login' && store.state.user) {
    return redirect('/account')
  }
}
