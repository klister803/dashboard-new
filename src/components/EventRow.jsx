import { useState, useEffect } from 'react'
import styles from './EventRow.module.css'

const EventRow = ({ event, filter, storage }) => {
  const [countdown, setCountdown] = useState('')
  const [sortnr, setSortnr] = useState(0)
  const [timeClass, setTimeClass] = useState(styles.timeOff)
  const [fullText, setFullText] = useState('')
  const [truncatedText, setTruncatedText] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const d = new Date()
      const time = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
      const times = event.event_times
      let j
      for (j = 0; j < times.length; j++) {
        const t = times[j].split(':')
        const sec = parseInt(t[0]) * 3600 + parseInt(t[1]) * 60
        if (sec > time) {
          break
        }
      }
      j = j % times.length
      const nextT = times[j]
      const tt = nextT.split(':')
      const nextSec = parseInt(tt[0]) * 3600 + parseInt(tt[1]) * 60
      let diff = nextSec - time
      if (diff < 0) diff += 86400
      
      const totalsecondy = diff
      const h = parseInt(diff / 3600)
      diff -= h * 3600
      const m = parseInt(diff / 60)
      const s = diff - m * 60
      const countdownStr = `${h}:${("0"+m).slice(-2)}:${("0"+s).slice(-2)}`
      
      setSortnr(totalsecondy)
      setCountdown(countdownStr)
      setTimeClass(h === 0 && totalsecondy <= 300 ? styles.timeOn : styles.timeOff)
      
      const text = `${nextT} - ${event.event_name} - ${event.description}`
      setFullText(text)
      setTruncatedText(text.length > 50 ? text.substring(0, 47) + '...' : text)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [event])

  const typeClass = event.type === 'elite' ? 'boss' : event.type
  const display = filter === 'all' || filter === typeClass ? '' : 'none'

  return (
    <tr className={`event-all all ${typeClass}`} style={{ display }}>
      <td className={styles.sortnr}>{sortnr}</td>
      <td>
        <span 
          className={styles.eventText} 
          data-fulltext={fullText}
          title={fullText}
        >
          {truncatedText}
        </span>
      </td>
      <td className={styles.eventTimer}>
        <span className={timeClass}>{countdown}</span>
      </td>
    </tr>
  )
}

export default EventRow
