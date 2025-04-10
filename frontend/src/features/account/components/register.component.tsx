import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { isEmailExistApi, registerApi } from "../apis/account.api";
import { User } from "../../../shared/lib/models";
import { alert } from "../../../shared/lib/services";
import { formatErrorMessage } from "../../../shared/lib/helpers/format.error";
import { TopHeader } from "../ui/header";
import useDebounce from "../../../shared/hooks/useDebounce";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [email, setEmail] = useState();
  const [emailValue] = useDebounce(email, 800);
  const [feedBack, setFeedBack] = useState("");
  const [validationStatus, setValidationStatus] = useState<
    "" | "success" | "warning" | "error" | "validating" | undefined
  >("");

  const isEmailExist = () => {
    if (!emailValue) return;

    isEmailExistApi(String(emailValue).trim())
      .then((response) => {
        if (response.isExist) {
          setValidationStatus("error");
          setFeedBack("Email already exists!");
        } else {
          setValidationStatus("success");
          setFeedBack("");
          return Promise.resolve();
        }
      })
      .catch((error) => {
        setValidationStatus("error");
        return Promise.reject(new Error(error?.message));
      });
  };

  useEffect(() => {
    isEmailExist();
  }, [emailValue]);

  const onFinish = async (values: User) => {
    registerApi(values)
      .then(
        () => {
          alert.success("Registration Successful!");
          navigate("/account/login");
        },
        (err) => {
          alert.error(
            formatErrorMessage({
              ...err,
              data: {
                ...err.data,
                message:
                  "Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
              },
            })
          );
        }
      )
      .catch((error) => {
        alert.error("Something went wrong", formatErrorMessage(error));
      });
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      scrollToFirstError
    >
      <TopHeader
        className=" mb-8"
        title="Welcome"
        caption="Register your account to get started."
      />
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: "Please input your First Name!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="First Name" />
      </Form.Item>

      <Form.Item
        name="lastName"
        rules={[{ required: true, message: "Please input your Last Name!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Last Name" />
      </Form.Item>

      <Form.Item
        name="email"
        help={feedBack}
        hasFeedback
        validateStatus={validationStatus}
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          () => ({
            async validator(rule, value) {
              if (value === "") {
                return setValidationStatus("error");
              } else {
                setEmail(value);
              }
            },
          }),
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
      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
          ({ getFieldValue }) => ({
            validator(_rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject("values don't match");
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <div className="flex justify-center">
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
          >
            Register
          </Button>
        </Form.Item>
      </div>
      <div className="flex justify-center gap-2  mt-4 ">
        <span className="text-light-gray">Already have an account?</span>{" "}
        <span
          onClick={() => navigate(`/account/login`)}
          className="text-blue-500 cursor-pointer"
        >
          Sign in
        </span>
      </div>
    </Form>
  );
};

export default Register;
