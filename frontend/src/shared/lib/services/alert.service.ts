import { notification } from "antd";
import { CloseIcon, SuccessIcon, WarningIcon } from "../../ui/icons";
import { AlertIcon, InfoIcon } from "../../ui/icons/notification.icons";

const defaultDuration = 2;
const customClassName = "app-notification";

interface AlertServiceInterface {
  error: (message: string, title?: string, duration?: number) => void;
  success: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
}

export class AlertService implements AlertServiceInterface {
  error = (
    message: string,
    title: string = "Error",
    duration?: number
  ): void => {
    const options = {
      message: title,
      description: message,
      duration: duration || defaultDuration,
      className: customClassName,
      icon: AlertIcon,
      closeIcon: CloseIcon,
    };
    notification.error(options);
  };

  success = (
    message: string,
    title: string = "Success",
    duration?: number
  ): void => {
    const options = {
      message: title,
      description: message,
      duration: duration || defaultDuration,
      className: customClassName,
      icon: SuccessIcon,
      closeIcon: CloseIcon,
    };
    notification.success(options);
  };

  warning = (
    message: string,
    title: string = "Warning",
    duration?: number
  ): void => {
    const options = {
      message: title,
      description: message,
      duration: duration || defaultDuration,
      className: customClassName,
      icon: WarningIcon,
      closeIcon: CloseIcon,
    };
    notification.warning(options);
  };

  info = (message: string, title: string = "Info", duration?: number): void => {
    const options = {
      message: title,
      description: message,
      duration: duration || defaultDuration,
      className: customClassName,
      icon: InfoIcon,
      closeIcon: CloseIcon,
    };
    notification.info(options);
  };
}

export const alert = new AlertService();
