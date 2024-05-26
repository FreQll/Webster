import axios, { GET_CONFIG } from '@/api/axios';
import React, { useEffect, useState } from 'react'
import { logout, selectUser } from "@/store/UserSlice";
import { useSelector } from 'react-redux';
import { Canvas } from '@/types/type';

const UserProfile = () => {
  const user = useSelector(selectUser);
  const [allProjects, setAllProjects] = useState([]);

  const getCanvas = async () => {
    const resp = await axios.get(`/canvas/user/${user.id}`, GET_CONFIG);
    if (resp.status === 200) {
      setAllProjects(resp.data);
    }
  }

  useEffect(() => {
    getCanvas();
  }, [])

  return (
    <div className='px-12'>
      {allProjects.length > 0 && (
        allProjects.map((canvas: Canvas) => (
          <div>
            <div></div>
            <div>
              <div>{canvas.name}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default UserProfile
