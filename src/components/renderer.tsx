import { Divide } from "lucide-react";
import Quill from "quill";

import { useState, useEffect, useRef } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setisEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) {
      return;
    }

    const conatiner = rendererRef.current;

    const quill = new Quill(document.createElement("div"));
    quill.enable(false);
    const contents = JSON.parse(value);
    quill.setContents(contents);

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;

    setisEmpty(isEmpty);

    conatiner.innerHTML = quill.root.innerHTML;

    return () => {
      if (conatiner) {
        conatiner.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) {
    return null;
  }

  return <div ref={rendererRef} className="ql-editor ql-renderer" />;
};

export default Renderer;
