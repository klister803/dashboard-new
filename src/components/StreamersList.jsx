import { useState, useEffect } from 'react'
import styles from './StreamersList.module.css'

const StreamersList = () => {
  const [streamers, setStreamers] = useState([])
  const [onlineStreamers, setOnlineStreamers] = useState([])

  useEffect(() => {
    const loadStreamers = async () => {
      try {
        const response = await fetch('/streamers.json')
        const data = await response.json()
        setStreamers(data)
        checkOnlineStatus(data)
      } catch (error) {
        console.error('Error loading streamers:', error)
      }
    }

    loadStreamers()
    const interval = setInterval(loadStreamers, 120000)
    return () => clearInterval(interval)
  }, [])

  const checkOnlineStatus = async (streamersData) => {
    const streamerNames = streamersData.map(s => s.name)
    if (streamerNames.length === 0) return

    try {
      const response = await fetch('/twitch_proxy.php', {
        method: 'GET',
        headers: {
          'Client-ID': 'cirsf6g94lpzogfcr6ftqdqfcmhwqk',
          'Authorization': 'Bearer igon7fhx0l3tu4rmcgszeozdf9o73v'
        }
      })
      const data = await response.json()
      setOnlineStreamers(data.data)
    } catch (error) {
      console.error('Error checking online status:', error)
    }
  }

  return (
    <div id="streamers-list" className={styles.streamersList}>
      <table>
        <tbody>
          {onlineStreamers.length === 0 ? (
            <tr><td><div>No streamers are online</div></td></tr>
          ) : (
            onlineStreamers.map((streamer, index) => (
              <tr key={index}>
                <td>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <a href={`https://www.twitch.tv/${streamer.user_login}`}
                             target="_blank"
                             style={{ color: 'white', fontWeight: 'bold' }}
                          >
                            {streamer.user_name}
                          </a>
                        </td>
                        <td style={{ color: 'green', fontWeight: 'bold' }}>
                          ONLINE
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default StreamersList
