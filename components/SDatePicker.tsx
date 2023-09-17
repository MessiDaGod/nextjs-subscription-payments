import {useState, useRef} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {tryParseDate} from './utils'

interface SDatePickerProps {
  dateString: string | null
  columnId?: string
  rowIndex?: number
  id?: string
  dateFormat?: string
  disabledKeyboardNavigation?: boolean
  columnIndex?: number
  onDateChange?: (e: any, dateString: string, rowIndex: number, columnIndex: number) => void
}

export default function SDatePicker({
  dateString,
  columnId,
  rowIndex,
  id,
  dateFormat = 'MM/dd/yyyy',
  disabledKeyboardNavigation = true,
  columnIndex,
  onDateChange,
}: SDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(dateString)

  const dateRef = useRef(null)

  function handleDateChange(e) {
    const date = new Date(e)
    const formattedDate = date.toLocaleDateString('en-US')
    setSelectedDate(formattedDate)
    onDateChange && onDateChange(e, formattedDate, rowIndex, columnIndex)
  }

  return (
    <div id={id} className="datepicker">
      <DatePicker
        ref={dateRef}
        selected={new Date(tryParseDate(dateString))}
        onChange={(e) => handleDateChange(e)}
        dateFormat={columnId.toLowerCase().includes('postmonth') ? 'MM/yyyy' : dateFormat}
        preventOpenOnFocus={true}
      />
    </div>
  )
}
