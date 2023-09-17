import styles from './Spinner2.module.css';

export default function Spinner2({}) {
  return (
    <div className={styles['td']}>
      <div className={styles['grid']}>
        <div className={styles['column']}>
          <div className={styles['spinner']}></div>
        </div>
      </div>
    </div>
  );
}
