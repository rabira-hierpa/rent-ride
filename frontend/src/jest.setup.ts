/// <reference types="node" />
import "@testing-library/jest-dom";
import "jest-canvas-mock";
import React from "react";

process.env.VITE_APP_ARCGIS_API_KEY =
  "AAPT3NKHt6i2urmWtqOuugvr9WQ-3kPUVAY3_T-cE04ACA4aF9WbP9ZtkThKPjVcpZTeFNGInIP1gexFqC-MzvTthhmLVZ68cgxYLdvTMGIEwLBCzW8qi93cUNyJgd_HONcrByfLY3I6J4yzU3mP1sUIkb7OYnBz557xxjnRjoBDSKc5u6ajc9WCzPkFH6LHYqAOsscwDLoeEJtwWSXjzhGviblqxxjekP5UIv1c6qabCfA.";

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

let mockFormValues: Record<string, unknown> = {};
let mockFormOnFinish: ((values: Record<string, unknown>) => void) | null = null;

const mockFormInstance = {
  getFieldValue: jest.fn((name: string) => mockFormValues[name]),
  resetFields: jest.fn(() => {
    mockFormValues = {};
  }),
  setFieldsValue: jest.fn((values: Record<string, unknown>) => {
    mockFormValues = { ...mockFormValues, ...values };
  }),
  validateFields: jest.fn().mockResolvedValue(mockFormValues),
  submit: jest.fn(() => {
    if (mockFormOnFinish) {
      mockFormOnFinish(mockFormValues);
    }
  }),
  __INTERNAL__: {
    name: "mockForm",
  },
  getInternalHooks: jest.fn(() => ({
    setValidateMessages: jest.fn(),
    setCallbacks: jest.fn((callbacks: Record<string, unknown>) => {
      if (callbacks.onFinish) {
        mockFormOnFinish = callbacks.onFinish as (
          values: Record<string, unknown>
        ) => void;
      }
    }),
    setPreserve: jest.fn(),
    setInitialValues: jest.fn(),
    useSubscribe: jest.fn(),
    setFieldsValue: jest.fn(),
    setFields: jest.fn(),
    getFieldsValue: jest.fn(() => mockFormValues),
    getFieldsError: jest.fn(),
    getFieldError: jest.fn(),
    getFieldInstance: jest.fn(),
    destroyForm: jest.fn(),
    getFields: jest.fn(),
    getFieldDecorator: jest.fn(),
    getFieldProps: jest.fn(),
    getFieldMeta: jest.fn(),
  })),
};

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  const MockFormItem = (props: {
    name?: string;
    label?: string;
    children?: React.ReactNode | (() => React.ReactNode);
    className?: string;
    style?: React.CSSProperties;
    rules?: Array<{
      required?: boolean;
      message?: string;
      [key: string]: unknown;
    }>;
    valuePropName?: string;
    initialValue?: unknown;
  }) => {
    if (props.name && props.initialValue !== undefined) {
      mockFormValues[props.name] = props.initialValue;
    }

    return React.createElement(
      "div",
      {
        className: "ant-form-item",
        "data-testid": `form-item-${props.name || props.label}`,
      },
      props.label &&
        React.createElement(
          "label",
          { className: "ant-form-item-label", htmlFor: props.name },
          props.label
        ),
      props.children &&
        (typeof props.children === "function"
          ? props.children()
          : React.cloneElement(props.children as React.ReactElement, {
              id: props.name,
              "data-testid": `input-${props.name}`,
              onChange: (e: { target: { value: unknown } }) => {
                if (props.name) {
                  mockFormValues[props.name] = e.target.value;
                }
                const originalOnChange = (props.children as React.ReactElement)
                  .props.onChange;
                if (originalOnChange) {
                  originalOnChange(e);
                }
              },
            }))
    );
  };

  const MockTable = jest.fn((props) => {
    const { dataSource, columns, rowKey, rowSelection, ...restProps } = props;

    const validDivProps = [
      "id",
      "className",
      "style",
      "children",
      "key",
      "ref",
    ];
    const filteredProps: { [key: string]: unknown } = {
      "data-testid": "car-table",
    };
    for (const key in restProps) {
      if (
        validDivProps.includes(key) ||
        key.startsWith("data-") ||
        key.startsWith("aria-")
      ) {
        filteredProps[key] = restProps[key];
      }
    }

    let tableContent: React.ReactNode = "Mock Table Content (No Data)";

    if (
      dataSource &&
      Array.isArray(dataSource) &&
      columns &&
      Array.isArray(columns)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tableContent = dataSource.map((item: any, index: number) => {
        const key =
          typeof rowKey === "function"
            ? rowKey(item)
            : item[rowKey || "key"] || index;

        // Create cells for ALL columns
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cells = columns.map((column: any, colIndex: number) => {
          let cellContent: React.ReactNode = "";
          if (column.render && typeof column.render === "function") {
            const value = column.dataIndex ? item[column.dataIndex] : undefined;
            cellContent = column.render(value, item, index);
          } else if (column.dataIndex) {
            cellContent = item[column.dataIndex];
          }
          if (
            typeof cellContent === "object" &&
            cellContent !== null &&
            !React.isValidElement(cellContent)
          ) {
            cellContent = JSON.stringify(cellContent);
          } else if (cellContent === null || cellContent === undefined) {
            cellContent = "";
          }

          return React.createElement(
            "div",
            {
              role: "cell",
              key: `cell-${key}-${column.key || column.dataIndex || colIndex}`,
            },
            cellContent
          );
        });

        const handleRowClick = () => {
          const selectedRow = dataSource.find(
            (r: Record<string, unknown>) =>
              (typeof rowKey === "function"
                ? rowKey(r)
                : r[(rowKey as string) || "key"]) === key
          );

          if (rowSelection && typeof rowSelection.onChange === "function") {
            const selectedKeysArg = [key];
            const selectedRowsArg = selectedRow ? [selectedRow] : [];

            try {
              rowSelection.onChange(selectedKeysArg, selectedRowsArg);
            } catch (e) {
              console.error(
                "MockTable: Error calling rowSelection.onChange:",
                e
              );
              throw e;
            }
          }
        };

        return React.createElement(
          "div",
          {
            key: `row-${key}`,
            "data-row-key": key,
            "data-testid": `table-row-${key}`,
            onClick: handleRowClick,
            style: { cursor: "pointer" },
            role: "row",
          },
          cells
        );
      });

      if (dataSource.length === 0) {
        tableContent = "Mock Table Content (Empty Data Source)";
      }
    }

    return React.createElement(
      "div",
      { ...filteredProps, role: "table" },
      tableContent
    );
  });

  return {
    ...antd,
    Table: MockTable,
    Form: {
      ...antd.Form,
      useForm: jest.fn(() => [mockFormInstance]),
      Item: MockFormItem,
    },
    Button: (props: {
      htmlType?: "submit" | "button" | "reset";
      onClick?: (e: React.MouseEvent) => void;
      children?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default";
      disabled?: boolean;
      loading?: boolean | { delay?: number };
      icon?: React.ReactNode;
    }) => {
      const { htmlType, onClick, ...restProps } = props;

      const domProps = {
        ...restProps,
        type: htmlType, // Convert htmlType to type which is valid for DOM button
        onClick: (e: React.MouseEvent) => {
          if (onClick) onClick(e);

          // For submit buttons, trigger the form submit
          if (htmlType === "submit") {
            mockFormInstance.submit();
          }
        },
      };

      return React.createElement("button", domProps, props.children);
    },
    // Mock notification to prevent act() warnings and track calls for testing
    notification: {
      success: jest.fn().mockImplementation((options) => {
        console.log("Mock notification success called with:", options);
        return { close: jest.fn() };
      }),
      error: jest.fn().mockImplementation((options) => {
        console.log("Mock notification error called with:", options);
        return { close: jest.fn() };
      }),
      info: jest.fn().mockImplementation((options) => {
        console.log("Mock notification info called with:", options);
        return { close: jest.fn() };
      }),
      warning: jest.fn().mockImplementation((options) => {
        console.log("Mock notification warning called with:", options);
        return { close: jest.fn() };
      }),
      open: jest.fn().mockImplementation((options) => {
        console.log("Mock notification open called with:", options);
        return { close: jest.fn() };
      }),
      close: jest.fn(),
      destroy: jest.fn(),
    },
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
    },
  };
});

class MockMapView {
  container = document.createElement("div");
  goTo = jest.fn();
  on = jest.fn().mockImplementation((event, handler) => {
    if (event === "click") {
      this.clickHandler = handler;
    }
    return {
      remove: jest.fn(),
    };
  });
  destroy = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toMap = jest.fn().mockImplementation((_coordinates) => ({
    latitude: 24.4539,
    longitude: 54.3773,
    type: "point",
    spatialReference: { wkid: 4326 },
  }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toScreen = jest.fn().mockImplementation((_point) => ({
    x: 100,
    y: 100,
  }));
  clickHandler:
    | null
    | ((event: {
        x: number;
        y: number;
        mapPoint?: {
          latitude: number;
          longitude: number;
          type: string;
          spatialReference?: { wkid: number };
        };
        button?: number;
        type?: string;
        stopPropagation?: () => void;
        preventDefault?: () => void;
      }) => void) = null;
}

class MockGraphic {
  constructor(public attributes: Record<string, unknown>) {}
}

jest.mock("@arcgis/core/Map", () =>
  jest.fn(() => ({
    add: jest.fn(),
    basemap: { load: jest.fn() },
  }))
);

jest.mock("@arcgis/core/views/MapView", () => jest.fn(() => new MockMapView()));
jest.mock("@arcgis/core/layers/GraphicsLayer", () =>
  jest.fn(() => ({
    graphics: [],
    add: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
  }))
);
jest.mock("@arcgis/core/Graphic", () => MockGraphic);
jest.mock("@arcgis/core/geometry/Point", () => jest.fn());
