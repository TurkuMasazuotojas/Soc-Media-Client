import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get(`https://soc-media-project.herokuapp.com/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
  }, [id]); // Include 'id' in the dependency array

  return (
    <div className='profilePageContnainer'>
      <div className='basicInfo'>
        <h1>Username: {username} </h1>
      </div>
      <div className='listOfPosts'></div>
    </div>
  );
}

export default Profile;