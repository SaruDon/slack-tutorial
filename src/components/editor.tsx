import Quill, { Delta, Op, QuillOptions } from "quill";
import Image from "next/image";
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
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { MdSend } from "react-icons/md";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";

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
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quilRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

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
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) {
                  return;
                }
                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
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

  const onEmojiSelect = (emoji: any) => {
    const quill = quilRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => {
          setImage(event.target.files![0]);
        }}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-35"
        )}
      >
        <div ref={containerRef} className="ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex itmes-center justify-center group/image">
              <button
                onClick={() => {
                  setImage(null);
                  imageElementRef.current!.value = "";
                }}
                className="bg-gray-800 rounded-full hidden group-hover/image:flex hover:bg-gray-900 absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
              >
                <XIcon className="size-3.5" />
              </button>
              <Image
                src={URL.createObjectURL(image)}
                alt="Updated Image"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
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
              <EmojiPopover onEmojiSelect={onEmojiSelect}>
                <Button disabled={disabled} size="iconSm" variant="ghost">
                  <Smile />
                </Button>
              </EmojiPopover>
              {variant === "create" && (
                <Hint label="Attach image">
                  <Button
                    disabled={disabled}
                    size="iconSm"
                    variant="ghost"
                    onClick={() => imageElementRef?.current?.click()}
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
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={disabled}
                    onClick={() => {
                      onSubmit({
                        body: JSON.stringify(quilRef.current?.getContents()),
                        image,
                      });
                    }}
                    className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                  >
                    Save
                  </Button>
                </div>
              )}
              {variant === "create" && (
                <Button
                  disabled={isEmpty || disabled}
                  onClick={() => {
                    onSubmit({
                      body: JSON.stringify(quilRef.current?.getContents()),
                      image,
                    });
                  }}
                  className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                >
                  <MdSend className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-sm text-muted-foreground flex justify-end opacity-0",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
