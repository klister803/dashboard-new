import { useState, useEffect } from 'react'
import EventRow from './EventRow'
import styles from './EventsList.module.css'
import Button from './ui/Button'

const EventsList = ({ storage }) => {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const storedFilter = sessionStorage.getItem(`${storage}-event-list-show`)
    if (storedFilter) {
      setFilter(storedFilter)
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch('/newdash.php')
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const script = doc.querySelector('script:last-of-type')
        if (script) {
          const content = script.textContent
          const startIndex = content.indexOf('var mysql_events =')
          if (startIndex !== -1) {
            const jsonString = content.substring(startIndex + 'var mysql_events ='.length).trim().slice(0, -1)
            const eventsData = JSON.parse(jsonString)
            setEvents(eventsData)
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()
  }, [storage])

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    sessionStorage.setItem(`${storage}-event-list-show`, newFilter)
  }

  return (
    <div id="events-list" className={styles.eventsList}>
      <div className={styles.eventsListButton} />
      <Button
        id="button-evt"
        className={`${styles.buttonEvent} ${filter === 'event' ? styles.active : ''}`}
        onClick={() => handleFilterChange('event')}
        style={{ backgroundImage: 'url(/assets/dashboard/images/button-event.png)' }}
        hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-event-hover.png)' }}
      >
        Events
      </Button>
      <Button
        id="button-boss"
        className={`${styles.buttonEvent} ${filter === 'boss' ? styles.active : ''}`}
        onClick={() => handleFilterChange('boss')}
        style={{ backgroundImage: 'url(/assets/dashboard/images/button-event.png)' }}
        hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-event-hover.png)' }}
      >
        Boss
      </Button>
      <Button
        id="button-inv"
        className={`${styles.buttonEvent} ${filter === 'inv' ? styles.active : ''}`}
        onClick={() => handleFilterChange('inv')}
        style={{ backgroundImage: 'url(/assets/dashboard/images/button-event.png)' }}
        hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-event-hover.png)' }}
      >
        Invasion
      </Button>
      <Button
        id="button-all"
        className={`${styles.buttonEvent} ${filter === 'all' ? styles.active : ''}`}
        onClick={() => handleFilterChange('all')}
        style={{ backgroundImage: 'url(/assets/dashboard/images/button-event.png)' }}
        hoverStyle={{ backgroundImage: 'url(/assets/dashboard/images/button-event-hover.png)' }}
      >
        All
      </Button>
      <table style={{ marginTop: '25px' }} id="c_events">
        <tbody>
          {events.map((event, index) => (
            <EventRow
              key={`${event.event_name}-${index}`}
              event={event}
              filter={filter}
              storage={storage}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventsList
