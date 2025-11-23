import React from 'react'
import { useParams } from 'react-router-dom'
const ShareProfile = () => {
    const {viewedUserId}=useParams();
  return (
    <div>
      shareprofile {viewedUserId}
    </div>
  )
}

export default ShareProfile
