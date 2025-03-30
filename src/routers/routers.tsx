import { Route, Routes } from 'react-router'
import PrivateRouters from './private.routers'
import NotFoundPage from '@/pages/not-found.page'
import LayoutPage from '@/pages/layout.page'
import HomePage from '@/pages/home/home.page'
import ProductPage from '@/pages/product/product.page'
import SigninPage from '@/pages/auth/signin.page'
import SignupPage from '@/pages/auth/signup.page'

const Routers = () => {
  const isAuthenticated = true

  return (
    <Routes>
      <Route element={<PrivateRouters isAllowed={isAuthenticated ? true : false} redirectTo='/signin' />}>
        <Route path='/' element={<LayoutPage />}>
          <Route index element={<HomePage />} />
          <Route path='' element={<ProductPage />} />
        </Route>
      </Route>
      <Route element={<PrivateRouters isAllowed={isAuthenticated ? false : true} redirectTo='/' />}>
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default Routers
