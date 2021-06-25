import React, {
  useRef,
  useEffect,
  useMemo,
  memo,
  useImperativeHandle,
  forwardRef,
} from "react";
import Button from "./Button";
import Input from "./Input";

function isHexColor(hex) {
  return (
    typeof hex === "string" && hex.length === 6 && !isNaN(Number("0x" + hex))
  );
}
const element = {
  BUTTON: "button",
  INPUT: "input",
};

const Editor = forwardRef(({ setHtml, html }, ref) => {
  const htmlRendered = useRef(false);
  const richTextField = useRef(null);

  const getEditorDocumentRef = () => {
    return richTextField.current.contentDocument;
  };

  useImperativeHandle(ref, () => ({
    getHtml() {
      return getEditorDocumentRef().getElementsByTagName("body")[0].innerHTML;
    },
  }));

  function getSelection() {
    if (getEditorDocumentRef() && getEditorDocumentRef().getSelection) {
      return getEditorDocumentRef().getSelection();
    } else if (getEditorDocumentRef() && getEditorDocumentRef().selection) {
      return getEditorDocumentRef().selection;
    }

    return null;
  }

  const handleColor = (val) => {
    if (!isHexColor(val)) return;

    execCommandWithArg("foreColor", "#" + val);
  };
  const execCommandWithArg = (command, arg) => {
    getEditorDocumentRef().execCommand(command, false, arg);
  };

  const handleFontSize = (val) => {
    execCommandWithArg("fontSize", "5");

    const sel = getSelection();
    if (sel.anchorOffset === sel.extentOffset) {
      let range = sel.getRangeAt(0);
      range.collapse(true);
      let span = document.createElement("span");
      span.style.fontSize = `${val}px`;
      span.innerHTML = "&nbsp;";
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      const fontElements = sel.anchorNode.parentNode;
      fontElements.removeAttribute("size");
      fontElements.style.fontSize = `${val}px`;
    }
  };

  const loadHtml = () => {
    getEditorDocumentRef().getElementsByTagName("body")[0].innerHTML = html;
  };

  const actions = useMemo(
    () => [
      {
        title: "Bold",
        execCommand: "bold",
        element: element.BUTTON,
      },
      {
        title: "Italic",
        execCommand: "italic",
        element: element.BUTTON,
      },
      {
        title: "Underline",
        execCommand: "underline",
        element: element.BUTTON,
      },
      {
        title: "Font Size(px)",
        execCommand: "fontSize",
        element: element.INPUT,
        type: "number",
        onchange: handleFontSize,
      },
      {
        title: "Color Hex Code",
        execCommand: "foreColor",
        element: element.INPUT,
        onchange: handleColor,
      },
      {
        title: "List",
        execCommand: "insertUnorderedList",
        element: element.BUTTON,
      },
    ],
    []
  );

  useEffect(() => {
    if (richTextField.current) {
      getEditorDocumentRef().designMode = "On";
    }
  }, []);

  useEffect(() => {
    if (html && !htmlRendered.current) {
      htmlRendered.current = true;
      loadHtml(html);
    }
  }, [html]);

  return (
    <div>
      <div>
        {actions.map((action) =>
          action.element === element.BUTTON ? (
            <Button
              key={action.title}
              editorRef={getEditorDocumentRef}
              cmd={action.execCommand}
            >
              {action.title}
            </Button>
          ) : (
            <Input
              key={action.title}
              placeholder={action.title}
              type={action.type ?? "text"}
              onChange={action.onchange}
            />
          )
        )}
      </div>
      <iframe
        ref={richTextField}
        title="editor"
        name="richTextField"
        className="editable-container my-2 "
      />
      {/* <button onClick={consoleHtml}>Console HTML</button> */}
    </div>
  );
});

export default memo(Editor);
