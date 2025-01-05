import { useState } from 'react'
import styles from './CharacterRow.module.css'
import Button from './ui/Button'

const CharacterRow = ({ character, storage }) => {
  const [level, setLevel] = useState(character.Title)
  const name = character.Name.replace('[', '').replace(']', '')
  const hasResets = level.indexOf('Resets') !== -1
  const search = `Name: [${name}]`
  const levelString = level.substring(level.indexOf(search) + search.length)
  const formattedLevel = levelString
    .replace('Level:', 'Lv:')
    .replace('[', '')
    .replace(']', '')
    .replace(' ,', ',')
    .replace('Master Level:', ', mL:')
    .replace('[', '')
    .replace(']', '')
    .replace(' ,', ',')
    .replace('Resets:', ', R:')
    .replace('[', '')
    .replace(']', '')
    .replace(' ,', ',')

  const getLevelParts = formattedLevel.split(' ')
  const clevel = getLevelParts[2]?.replace(',', '') || '0'
  const mlevel = getLevelParts[4]?.replace(',', '') || '0'
  const resets = hasResets ? getLevelParts[6]?.replace(',', '') || '0' : '0'

  const handleStatusChange = () => {
    if (window.chrome?.webview) {
      window.chrome.webview.postMessage({
        functionId: 7,
        args: [7, name, character.Code, character.Handle]
      })
    }
  }

  return (
    <tr id={`tr-${name}`}>
      <td>
        <div>
          <table>
            <tbody>
              <tr>
                <td style={{ width: '57%', paddingTop: '4px' }}>
                  <span style={{ paddingTop: '5px' }}>{name}</span>
                </td>
                <td rowSpan="2" id={`buttons-${name}`}>
                  <span style={{ display: 'none' }} id={`clevel-${name}`}>{clevel}</span>
                  <span style={{ display: 'none' }} id={`mlevel-${name}`}>{mlevel}</span>
                  <span style={{ display: 'none' }} id={`reset-${name}`}>{resets}</span>
                  <Button
                    onClick={handleStatusChange}
                    style={{
                      backgroundImage: 'url(/assets/dashboard/images/button-news.png)',
                      backgroundSize: 'cover',
                      border: '0',
                      width: '39px',
                      height: '33px',
                      fontSize: '10px',
                      color: '#999',
                      fontWeight: '100',
                      paddingLeft: '3px',
                      marginTop: '2px',
                      marginLeft: '3px'
                    }}
                    hoverStyle={{
                      backgroundImage: 'url(/assets/dashboard/images/button-news-hover.png)',
                      color: '#ccc',
                      fontWeight: '100'
                    }}
                  >
                    <i className="fa fa-window-maximize" aria-hidden="true"></i>
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <p style={{ marginTop: '0px', fontSize: '9px', color: '#999', float: 'left' }} id={`level-${name}`}>
                    {formattedLevel}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  )
}

export default CharacterRow
