import { useState } from 'react'
import { Navbar } from '../ui/Navbar'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { messages } from '../../helpers/calendar-messages-sp';
import { CalendarEvent } from './CalendarEvent';

import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenModal } from '../../actions/ui';
import { eventSetActive } from '../../actions/events';
import { AddNew } from '../ui/AddNew';

moment.locale('es');
const localizer = momentLocalizer(moment)


const CalendarScreen = () => {

  const dispatch = useDispatch();
  const { events } = useSelector( state => state.calendar );

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month')

  const onDoubleClickEvent = (e) => {
    dispatch(uiOpenModal())
  }
  const onSelectEvent = (e) => {
    dispatch(eventSetActive(e))
  }
  const onViewChange = (e) => {
    setLastView(e)
    localStorage.setItem('lastView', e)
  }

  const onSelectSlot = (e) => {
    const newEvent = {
      start: e.slots[0],
      end: e.slots[e.slots.length - 1]
    }
    dispatch(eventSetActive(newEvent))
    dispatch(uiOpenModal())
  }

  const eventStyleGetter = (e, start, end, isSelected ) => {
    const style = {
      backgroundColor: '#367CF7',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white'
    }

    return style;
  }
  return (
    <div className = "calendar-screen">
      <Navbar/>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages = {messages}
        eventPropGetter = { eventStyleGetter }
        onDoubleClickEvent = { onDoubleClickEvent }
        onSelectEvent  = { onSelectEvent }
        onSelectSlot = { onSelectSlot}
        selectable = { true }
        onView = { onViewChange }
        components = {{
          event: CalendarEvent
        }}
        view = { lastView }
      />

      <CalendarModal/>

      <AddNew/>
    </div>
  )
}

export default CalendarScreen