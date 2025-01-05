import styles from './Switch.module.css'

const Switch = ({ 
  id, 
  checked = false, 
  disabled = false, 
  onChange, 
  onClick 
}) => {
  return (
    <label className={styles.switch} onClick={onClick}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  )
}

export default Switch
