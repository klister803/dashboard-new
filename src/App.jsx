import { useState } from 'react'
import UsersList from './components/UsersList'
import EventsList from './components/EventsList'
import NewsList from './components/NewsList'
import StreamersList from './components/StreamersList'
import SettingsList from './components/SettingsList'
import CareerFrame from './components/CareerFrame'
import styles from './App.module.css'
import Button from './components/ui/Button'

const App = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [storage] = useState('web')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <Button
          id="button-users"
          className={`${styles.buttonTop} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => handleTabClick('users')}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-top-users.png)' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-top-users-hover.png)' }}
        />
        <Button
          id="button-events"
          className={`${styles.buttonTop} ${activeTab === 'events' ? styles.active : ''}`}
          onClick={() => handleTabClick('events')}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-top-events.png)' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-top-events-hover.png)' }}
        />
        <Button
          id="button-news"
          className={`${styles.buttonTop} ${activeTab === 'news' ? styles.active : ''}`}
          onClick={() => handleTabClick('news')}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-top-news.png)' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-top-news-hover.png)' }}
        />
        <Button
          id="button-streamers"
          className={`${styles.buttonTop} ${activeTab === 'streamers' ? styles.active : ''}`}
          onClick={() => handleTabClick('streamers')}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-top-streams.png)', display: 'none' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-top-streams-hover.png)' }}
        />
      </div>

      <div className={styles.container}>
        {activeTab === 'users' && <UsersList storage={storage} />}
        {activeTab === 'events' && <EventsList storage={storage} />}
        {activeTab === 'news' && <NewsList />}
        {activeTab === 'streamers' && <StreamersList />}
        {activeTab === 'settings' && <SettingsList />}
        {activeTab === 'career' && <CareerFrame />}
      </div>

      <div className={styles.footer}>
        <Button
          className={styles.buttonDown}
          onClick={() => window.chrome?.webview?.postMessage({
            functionId: 4,
            args: ['http://localhost/']
          })}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-down.png)' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-down-hover.png)' }}
        >
          Site
        </Button>
        <Button
          className={styles.buttonDown}
          onClick={() => window.chrome?.webview?.postMessage({
            functionId: 4,
            args: ['https://discord.com/']
          })}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-discord.png)', marginLeft: '80px', marginTop: '1px' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-discord-hover.png)' }}
        />
        <Button
          className={styles.buttonDown}
          onClick={() => window.chrome?.webview?.postMessage({
            functionId: 4,
            args: ['http://localhost/guides']
          })}
          style={{ backgroundImage: 'url(/assets/dashboard/images/button-down.png)', marginLeft: '157px' }}
          hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-down-hover.png)' }}
        >
          Helper
        </Button>
      </div>
    </div>
  )
}

export default App
