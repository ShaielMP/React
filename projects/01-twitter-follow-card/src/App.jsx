import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard'

function App() {

  const users = [
    {
      isFollowing: false, 
      username: 'midudev',
      name: 'Miguel Angel Duran'
    },
    {
      isFollowing: false,
      username: 'SatoruGojo',
      name: 'Satoru Gojo'
    },
    {
      isFollowing: false,
      username: 'ShaielMP',
      name: 'Shaiel Montesdeoca'
    },
    {
      isFollowing: false,
      username: 'Illojuan',
      name: 'Juan Alberto'
    },
  ]
  
  return (
    <section className='App'>
      {
        users.map(({name, username, isFollowing}) => (
          <TwitterFollowCard 
            key={username} 
            username={username} 
            isFollowing={isFollowing}
          >
          {name}
          </TwitterFollowCard>
        ))
      }
    </section>
  )
}

export default App
