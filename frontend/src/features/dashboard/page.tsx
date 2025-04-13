import { useState, useEffect, useRef } from "react";
import ControlPanel from "./components/control.panel.component";
import { Layout, Drawer, Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import MapContainer from "./components/map.container.component";
import { MapViewHandle } from "../../types";

const MOBILE_BREAKPOINT = 768;

const DashboardPage = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isReturnCarLoading, setIsReturnCarLoading] = useState(false);
  const mapDivRef = useRef<MapViewHandle>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setDrawerVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ position: "relative", height: "100vh" }}>
          <MapContainer
            ref={mapDivRef}
            isReturnCarLoading={isReturnCarLoading}
          />
          {isMobile && (
            <Button
              type="primary"
              shape="circle"
              icon={<MenuOutlined />}
              size="large"
              onClick={showDrawer}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
              }}
            />
          )}
        </Content>
        {!isMobile && (
          <Sider
            width={700}
            theme="light"
            style={{ height: "100vh", overflow: "auto" }}
          >
            <ControlPanel
              mapRef={mapDivRef}
              isReturnCarLoading={isReturnCarLoading}
              setIsReturnCarLoading={setIsReturnCarLoading}
            />
          </Sider>
        )}
      </Layout>
      <Drawer
        title="Car Details"
        placement="right"
        closable={true}
        onClose={closeDrawer}
        open={drawerVisible}
        width={320}
        closeIcon={<CloseOutlined />}
      >
        <ControlPanel
          mapRef={mapDivRef}
          isReturnCarLoading={isReturnCarLoading}
          setIsReturnCarLoading={setIsReturnCarLoading}
        />
      </Drawer>
    </Layout>
  );
};

export default DashboardPage;
