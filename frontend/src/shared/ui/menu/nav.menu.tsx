import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import UserBadge from "../badge/user.badge";
import { NavigateFunction } from "react-router-dom";

const NavMenu = ({ navigate }: { navigate: NavigateFunction }) => {
  const { logout, authState } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/account/login");
  };

  return (
    <div className="flex space-x-4 items-center">
      <UserBadge
        fullName={authState?.user?.fullName ?? ""}
        hasDropDown={true}
        logout={handleLogout}
      />
    </div>
  );
};

export default NavMenu;
