import type { NextPage } from 'next'
import Login from './login'

const Home: NextPage = () => {
  return (
    <div className='w-full h-full'>
      <Login />
    </div>
  )
}

export default Home
