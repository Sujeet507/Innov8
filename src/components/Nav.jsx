import React from "react";
import { supabase } from "../supabaseClient";
import { Navigate, useNavigate } from "react-router-dom";

import skybaseLogo from "../assets/skybase.png";

const Nav = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    supabase.auth.signOut();
    navigate("/login");
  };
  return (
    <div className="">
      <div className="navbar bg-base-100 shadow-sm px-12">
        <div className="flex-1">
          <img src={skybaseLogo} className="object-cover w-10 h-10" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="dropdown dropdown-end">
            <h5 class="text-white">{userName}</h5>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
