import React from 'react'

const Container = ({ children } : { children: React.ReactNode }) => {
  return (
    <div className='m-auto flex flex-col h-full'>
      { children }
    </div>
  )
}

export default Container
