import { Avatar, Dropdown, Menu } from "antd";
import { AuthContext } from "../../context/auth.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
export const userNameInitials = (input: string) => {
  if (input) {
    const names = input?.split(" ");
    return names?.reduce((reduced, item) => {
      return `${reduced}${item.substring(0, 1).toUpperCase()}`;
    }, "");
  }
};
interface UserBadgeProps {
  fullName: string;
  logout?: () => void;
  imageUrl?: string;
  hasDropDown: boolean;
  menuItems?: (React.ReactNode | React.ReactChild | React.FC)[];
}
const UserBadge = ({
  fullName,
  hasDropDown,
  imageUrl,
  logout,
  menuItems = [],
}: UserBadgeProps) => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const userBadgeContent = () => {
    return (
      <div className="flex items-center space-x-2 cursor-pointer">
        <span
          className="font-medium capitalize  text-3"
          style={{ color: "#18191F" }}
        >
          {fullName}
        </span>
        <Avatar
          src={imageUrl}
          style={{
            backgroundColor: "#f3ce5b",
            color: "#18191f",
          }}
        >
          {userNameInitials(fullName)}
        </Avatar>
      </div>
    );
  };

  const menu = (
    <Menu
      style={{
        borderRadius: "4px",
        boxShadow: "0px 0px 20px 0px rgba(18, 62, 119, 0.2)",
        minWidth: "8rem",
      }}
    >
      {menuItems?.map((item, index) => (
        <Menu.Item key={index}>
          {typeof item === "function" ? item({}) : item}
        </Menu.Item>
      ))}
      {}
      {menuItems?.length > 0 && <Menu.Divider key="divider" />}
      {isAdmin && (
        <Menu.Item key="admin" onClick={() => navigate("/admin")}>
          <span>Admin</span>
        </Menu.Item>
      )}
      <Menu.Item onClick={logout} key="logout">
        <span>Logout</span>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="flex items-center space-x-2">
      {hasDropDown ? (
        <Dropdown overlay={menu} placement="bottom">
          {userBadgeContent()}
        </Dropdown>
      ) : (
        userBadgeContent()
      )}
    </div>
  );
};

export default UserBadge;
