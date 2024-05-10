import { getUser } from "@/helper/getUser";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { logout, selectUser } from "@/store/UserSlice";
import { useDispatch } from "react-redux";

export const Navbar = () => {
  //   const [user, setUser] = useState(getUser());
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  console.log(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    // setUser(null);
    dispatch(logout());
  };

  return (
    <div className="flex flex-row justify-between items-center px-12">
      <Link to="/" className="flex flex-row gap-2 items-center">
        <img
          src="favicon.svg"
          alt="WhiteCanvas Logo"
          className="w-[36px] h-[36px]"
        />
        <h1>WhiteCanvas</h1>
      </Link>

      <div className="flex flex-row gap-2 items-center">
        {user.id ? (
          <div>
            {user.name}
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <div>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};
