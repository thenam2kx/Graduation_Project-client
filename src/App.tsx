import { useQuery } from '@tanstack/react-query'
import Routers from './routers/routers'
import { fetchAccountAPI } from './services/user-service/user.apis'
import { useNavigate } from 'react-router'


const App = () => {
  const navigate = useNavigate()
  const { data: infoUser } = useQuery({
    queryKey: ['homeData'],
    queryFn: async () => {
      const res = await fetchAccountAPI()
      return res.data
    },
    refetchOnWindowFocus: false
  })
  if (!infoUser) {
    navigate('/signin')
  }

  return (
    <div>
      <Routers />
    </div>
  )
}

export default App
