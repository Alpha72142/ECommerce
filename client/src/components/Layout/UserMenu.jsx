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
          `block w-full px-4 py-2 border-y border-gray-200 cursor-pointer 
             dark:border-gray-600 
           dark:hover:bg-cyan-900 dark:hover:text-white 
           ${isActive ? "bg-cyan-900 text-white" : ""}`
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/dashboard/user/orders"
        className={({ isActive }) =>
          `block w-full px-4 py-2 border-b border-gray-200 cursor-pointer 
             dark:border-gray-600 
           dark:hover:bg-cyan-900 dark:hover:text-white 
           ${isActive ? "bg-cyan-900 text-blue-50 dark:bg-cyan-900 dark:text-white" : ""}`
        }
      >
       Orders
      </NavLink>
    </div>
  )
}

export default UserMenu