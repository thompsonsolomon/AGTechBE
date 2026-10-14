import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  )
}

export default AdminLayout