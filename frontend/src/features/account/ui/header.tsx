import React from "react";

interface TopHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  caption?: React.ReactNode;
}
export const TopHeader = (props: TopHeaderProps) => {
  return (
    <div {...props} className={`${props.className} text-center`}>
      <span className="block mb-0.5 text-xl text-secondary-blue font-semibold">
        {props.title}
      </span>
      <span className="block text-sm text-light-gray">{props?.caption}</span>
    </div>
  );
};
