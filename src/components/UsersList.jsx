import { useState, useEffect } from 'react'
import CharacterRow from './CharacterRow'
import styles from './UsersList.module.css'

const UsersList = ({ storage }) => {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    const loadCharacters = () => {
      const storedCharacters = localStorage.getItem(`${storage}-Characters`)
      if (storedCharacters) {
        setCharacters(JSON.parse(storedCharacters))
      }
    }

    loadCharacters()
    const interval = setInterval(() => {
      if (window.chrome?.webview) {
        window.chrome.webview.postMessage({
          functionId: 6,
          args: [storage]
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [storage])

  return (
    <div id="users-list" className={styles.usersList}>
      <table>
        <tbody>
          {characters.map((character, index) => (
            <CharacterRow 
              key={`${character.Name}-${index}`}
              character={character}
              storage={storage}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersList
