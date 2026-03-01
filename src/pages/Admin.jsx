import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Panel</h1>

      {/* THIS LINE IS VERY IMPORTANT */}
      <Outlet />
    </div>
  );
};

export default Admin;