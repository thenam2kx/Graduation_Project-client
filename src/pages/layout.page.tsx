import AppFooter from '@/components/app/app.footer'
import AppHeader from '@/components/app/app.header'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router'


const LayoutPage = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader />
      <Box>
        <Outlet />
      </Box>
      <AppFooter />
    </Box>
  )
}

export default LayoutPage
