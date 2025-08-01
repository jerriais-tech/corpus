import React from "react";

interface Props {
  children: string;
}

const Content: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="prose prose-img:mx-auto"
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
};

export default Content;
