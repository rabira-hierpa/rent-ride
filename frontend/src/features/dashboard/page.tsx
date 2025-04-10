import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import ControlPanel from "./components/ControlPanel";
import MapContainer from "./components/MapContainer";
import "@arcgis/core/assets/esri/themes/light/main.css";

const DashboardPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider width={300} theme="light">
          <ControlPanel />
        </Sider>
        <Content style={{ position: "relative" }}>
          <MapContainer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
