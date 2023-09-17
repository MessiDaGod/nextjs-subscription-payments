import {useEffect} from 'react'

export default function PopupBox({id, message, showIcon = true}) {
  useEffect(() => {
    const infoSpan = document.getElementById('popupBox' + id)
    infoSpan.addEventListener('mouseenter', toggleAbstractHelp)
    infoSpan.addEventListener('mouseleave', toggleAbstractHelp)
    return () => {
      infoSpan.removeEventListener('mouseenter', toggleAbstractHelp)
      infoSpan.removeEventListener('mouseleave', toggleAbstractHelp)
    }
  }, [id])

  function toggleAbstractHelp() {
    const elem = document.getElementById(id)
    if (elem.style.display === 'none') {
      elem.style.display = 'flex'
    } else if (elem.style.display === 'flex') {
      elem.style.display = 'none'
    }
  }

  return (
    <div id={'popupBox' + id} style={{ display: 'flex' }}>
      <span id={'infoSpan' + id} className="material-symbols-outlined" style={{fontSize: '18px', color: showIcon ? 'white' : 'transparent' }}>
        info
      </span>
      <div
        id={id}
        style={{
          display: 'none',
          flexDirection: 'column',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          position: 'absolute',
          transform: 'translateY(20px)',
          backgroundColor: 'white',
          color: 'black',
        }}>
        <span style={{fontSize: '18px'}} className="material-symbols-outlined white">
          edit_note
        </span>
        <ul className="func bg-white color-black pl-4 pr-4 fs16 mw200 pb10">
          <li>{message}</li>
        </ul>
      </div>
    </div>
  )
}
