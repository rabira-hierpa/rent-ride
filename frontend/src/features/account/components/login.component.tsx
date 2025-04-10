import React, { useContext } from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TopHeader } from "../ui/header";
import { Credentials } from "../../../shared/lib/types/crednetialds.type";
import { loginApi } from "../apis/account.api";
import { alert, storage } from "../../../shared/lib/services";
import { AuthContext } from "../../../shared/context/auth.context";
import { formatErrorMessage } from "../../../shared/lib/helpers/format.error";

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [form] = Form.useForm();

  const onFinish = async (values: Credentials) => {
    try {
      loginApi(values).then(
        (response) => {
          if (response.accessToken) {
            storage.setItem("accessToken", response?.accessToken?.accessToken);
          }
          if (authContext && authContext.setAuthState) {
            authContext.setAuthState({
              token: response?.accessToken?.accessToken,
              user: response?.user,
              expiresAt: (
                Date.now() +
                response?.accessToken?.expiresIn * 1000
              ).toString(),
            });
            if (authContext.isAdmin) {
              navigate("/admin");
            } else {
              navigate("/dashboard");
            }
          } else {
            alert.error("Failed to login user");
          }
        },
        (err) => {
          alert.error(formatErrorMessage(err));
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert.error(formatErrorMessage(error));
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      initialValues={{
        email: "",
        password: "",
      }}
    >
      <TopHeader
        className=" mb-8"
        title="Welcome Back"
        caption="Enter your credentials to access your account."
      />
      <Form.Item
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
          {
            min: 8,
            message: "Password must be at least 8 characters long!",
          },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <div className="flex justify-center">
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </div>
      <div className="flex justify-center gap-2  mt-4">
        <span className="text-light-gray">Don’t have an account yet?</span>{" "}
        <span
          onClick={() => navigate(`/account/register`)}
          className="text-blue-500 cursor-pointer"
        >
          Create Account
        </span>
      </div>
    </Form>
  );
};

export default Login;
