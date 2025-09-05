import { use, useState } from 'react'

export function TwitterFollowCard({ username = 'unknown', children}) {
    const [isFollowing, setIsFollowing] = useState(false)

    
    const text = isFollowing ? 'Siguiendo' : 'Seguir'
    const buttonClassName = isFollowing ? 'sg-followCard-button is-following' : 'sg-followCard-button'
    
    const handleClick = () => {
        setIsFollowing(!isFollowing)
    }
    
    return (
        <article className='sg-followCard'>
            <header className='sg-followCard-header'>
                <img className='sg-followCard-avatar' src={`https://unavatar.io/${username}`} alt="El avatar de Satoru Gojo" />
                <div className='sg-followCard-info'>
                    <strong>{children}</strong>
                    <span className='sg-followCard-username'>@{username}</span>
                </div>
            </header>

            <aside>
                <button className={buttonClassName} onClick={handleClick}>
                    <span className='sg-followCard-text'>{text}</span>
                    <span className='sg-followCard-stopFollow'>Dejar de seguir</span>
                </button>
            </aside>
        </article>
    )
}