import { NavLink } from 'react-router-dom'

const UserMenu = () => {
  return (
    <div className="w-full text-sm text-center font-medium border rounded-lg bg-gray-700 border-gray-600 text-white">
      <h3 className="my-2 text-2xl tracking-tight text-white">
        <NavLink to="/dashboard/user">Dashboard</NavLink>
      </h3>

      <NavLink
        to="/dashboard/user/profile"
        className={({ isActive }) =>
          `block w-full px-4 py-2 border-y cursor-pointer 
             border-gray-600 
           hover:bg-cyan-900 hover:text-white 
           ${isActive ? "bg-cyan-900 text-white" : ""}`
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/dashboard/user/orders"
        className={({ isActive }) =>
          `block w-full px-4 py-2 border-b cursor-pointer 
             border-gray-600 
           hover:bg-cyan-900 hover:text-white 
           ${isActive ? "bg-cyan-900 text-white" : ""}`
        }
      >
       Orders
      </NavLink>
    </div>
  )
}

export default UserMenu