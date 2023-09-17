import React, {PropsWithoutRef} from 'react'

interface Progress {
  value: number
}

interface ProgressStep {
  value: string
}

interface Props {
  progress?: Progress
  display?: boolean
  total?: number
  progressStep?: ProgressStep
}

const intialProgress = {value: 0}
const initialProgressStep = {value: ''}

export default function LoadingBar({
  progress = intialProgress,
  display = false,
  total = 10,
  progressStep = initialProgressStep,
}: Props) {
  return (
    <div id="loadingBar2">
      <div
        style={{
          width: '300px',
          height: '10px',
          backgroundColor: '#ccc',
          position: 'relative',
          display: display ? 'flex' : 'none',
        }}>
        <div
          style={{
            width: `${Number(progress.value).toFixed(0)}%`,
            height: '100%',
            backgroundColor: '#007bff',
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'width 0.5s ease-in-out',
          }}></div>
      </div>
      <div style={{display: display ? 'flex' : 'none', justifyContent: 'space-between', color: 'white', fontSize: '14px'}}>
        {Number(progress.value).toFixed(2)}% of {'100%'} {progressStep.value}
      </div>
    </div>
  )
}
