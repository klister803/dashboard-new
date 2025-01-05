import styles from './SettingsList.module.css'
import Switch from './ui/Switch'

const SettingsList = () => {
  return (
    <div id="settings-list" className={styles.settingsList}>
      <table>
        <tbody>
          <tr>
            <td colSpan="2" align="left">
              <h3>Client Settings</h3>
              <hr />
            </td>
          </tr>
          <tr>
            <td>New Effects</td>
            <td>
              <Switch
                id="new-effect"
                onChange={() => {
                  if (window.chrome?.webview) {
                    window.chrome.webview.postMessage({
                      functionId: 11,
                      args: []
                    })
                  }
                }}
              />
            </td>
          </tr>
          <tr><td colSpan="2"><br /></td></tr>
          <tr>
            <td colSpan="2" align="left">
              <h3>Alerts Settings</h3>
              <hr />
            </td>
          </tr>
          {['Events', 'Streamers', 'Others', 'General'].map((setting) => (
            <tr key={setting}>
              <td>{setting}</td>
              <td>
                <Switch
                  disabled
                  checked
                  onClick={() => {
                    if (window.chrome?.webview) {
                      window.chrome.webview.postMessage({
                        functionId: 12,
                        args: ['Sorry, this feature is under development!', 'Error']
                      })
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SettingsList
