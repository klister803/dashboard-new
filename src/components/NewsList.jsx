import styles from './NewsList.module.css'
import Button from './ui/Button'

const NewsList = () => {
  return (
    <div id="news-list" className={styles.newsList}>
      <table>
        <tbody>
          <tr>
            <td>
              <div>
                <table>
                  <tr>
                    <td style={{ color: '#4bc749' }}>[News]</td>
                    <td rowSpan="2">
                      <Button
                        onClick={() => {
                          if (window.chrome?.webview) {
                            window.chrome.webview.postMessage({
                              functionId: 4,
                              args: ['https://example.com/news']
                            })
                          }
                        }}
                        style={{
                          backgroundImage: 'url(/assets/dashboard/images/button-news.png)',
                          backgroundSize: 'cover',
                          border: '0',
                          width: '39px',
                          height: '33px',
                          fontSize: '18px',
                          color: '#dbaf20',
                          fontWeight: '100',
                          paddingLeft: '3px'
                        }}
                        hoverStyle={{
                          backgroundImage: 'url(/assets/dashboard/images/button-news-hover.png)',
                          color: '#dbaf20',
                          fontWeight: '100'
                        }}
                      >
                        +
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style={{
                        width: '160px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        lineHeight: '11px'
                      }}
                      title="Test Title">
                        TEST
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default NewsList
