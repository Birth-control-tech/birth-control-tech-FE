import React, {useState} from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';


const CalendarPage = () => {
  const [givenDate, setDate] = useState<Date>(new Date());
  
  return(
   <main className='calendar'>
     <h1 className='headings'>Calendar</h1>
     <section className='calendar-container'>
      <Calendar
          onClickDay={setDate}
          value={givenDate}
        />
     </section>
   </main>
  );
}

export default CalendarPage;