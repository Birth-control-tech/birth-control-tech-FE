import React from 'react';
import './Profile.css';
import ProfileForm from '../ProfileForm/ProfileForm';
// import './../Index.css';

export interface ProfileProps {
  lastOvulation: string,
  duration: number,
  averageCycle: number,
}

const Profile: React.SFC<ProfileProps> = ({lastOvulation, duration, averageCycle}) => {
  return (
    <main className='profile'>
      <h1 className='headings test'>Profile</h1>
      <section className='profile-container'>
        {/* <p>
         <span>Last Ovulation: </span> <br/>{lastOvulation}
        </p>
        <p>
         <span>Duration: </span> <br/>{duration} Days
        </p>
        <p>
         <span>Average Cycle Length: </span> <br/>{averageCycle} Days
        </p> */}
        <ProfileForm />
      </section>
      <button className='logout-button'>Logout</button>
    </main>
  )
}
export default Profile;