import Quill, { Delta, Op, QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Keyboard, Smile } from "lucide-react";
import { MdSend } from "react-icons/md";
import { Hint } from "./hint";
import { current } from "../../convex/members";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onCancel?: () => void;
  defaultValue?: Delta | Op[];
  placeholder?: string;
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  onSubmit: ({ image, body }: EditorValue) => void;
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = "Write something..",
  defaultValue = [],
  disabled = false,
  variant = "create",
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quilRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],

        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                //Todo submit form
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quilRef.current = quill;
    quilRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quilRef.current) {
        quilRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="ql-custom" />
        <div className="flex-2  px-2 pb-2 z-[5]">
          <div className="flex items-center justify-between">
            <div>
              <Hint
                label={
                  !isToolbarVisible ? "Show formatting" : "Hide formatting"
                }
              >
                <Button
                  disabled={disabled}
                  size="iconSm"
                  variant="ghost"
                  onClick={toggleToolbar}
                >
                  <PiTextAa />
                </Button>
              </Hint>
              <Hint label="Emojis">
                <Button
                  disabled={disabled}
                  size="iconSm"
                  variant="ghost"
                  onClick={() => {}}
                >
                  <Smile />
                </Button>
              </Hint>
              {variant === "create" && (
                <Hint label="Attach image">
                  <Button
                    disabled={disabled}
                    size="iconSm"
                    variant="ghost"
                    onClick={() => {}}
                  >
                    <ImageIcon />
                  </Button>
                </Hint>
              )}
            </div>
            <div>
              {variant === "update" && (
                <div className="gap-x-3 m-auto flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => {}}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={disabled}
                    onClick={() => {}}
                    className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                  >
                    Save
                  </Button>
                </div>
              )}
              {variant === "create" && (
                <Button
                  disabled={isEmpty || disabled}
                  onClick={() => {}}
                  className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                >
                  <MdSend className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 text-sm text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
