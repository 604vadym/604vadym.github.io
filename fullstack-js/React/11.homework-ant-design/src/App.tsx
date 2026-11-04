import { ConfigProvider, Layout, Typography } from "antd";
import FormAntDesign from "./components/FormAntDesign";
import "./styles.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#1677ff", borderRadius: 8 } }}
    >
      <Layout className="app-layout">
        <Content className="app-content">
          <section className="form-panel">
            <Title level={2}>Create your account</Title>
            <Paragraph type="secondary">
              Complete the form below to create your account.
            </Paragraph>
            <FormAntDesign />
          </section>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
export default App;
