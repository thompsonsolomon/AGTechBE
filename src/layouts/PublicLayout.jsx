import { Outlet } from 'react-router-dom'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}

export default PublicLayout