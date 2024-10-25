import React, { useEffect, useState } from "react";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import * as io from "socket.io-client";
import "./PlaygroundPage.css";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../constants";

const SAVE_INTERVAL_MS = 2000;
const RUN_INTERVAL_MS = 1200;

export const PlaygroundPage = (props) => {
  let { projectID } = useParams();

  const [html, setHtml] = useState("loading...");
  const [css, setCss] = useState("loading...");
  const [js, setJs] = useState("loading...");
  const [selectedLang, setSelectedLang] = useState("HTML"); // New state for dropdown
  const [delayedCodes, setDelayedCodes] = useState({ html, css, js });
  const [socket, setSocket] = useState();

  // Connect to socket
  useEffect(() => {
    const s = io(BASE_URL, {
      reconnection: false,
      query: "room=" + projectID,
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [projectID]);

  // Get project
  useEffect(() => {
    if (projectID !== undefined && socket !== undefined) {
      socket.emit("project_get", {
        room: projectID,
      });
    }
  }, [projectID, socket]);

  // Delayed auto run codes
  useEffect(() => {
    const interval = setInterval(() => {
      setDelayedCodes({ html, css, js });
    }, RUN_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [html, css, js]);

  // Auto save
  useEffect(() => {
    if (
      socket === undefined ||
      html === "loading..." ||
      css === "loading..." ||
      js === "loading..."
    )
      return;
    const interval = setInterval(() => {
      socket.emit("project_save", {
        room: projectID,
        html: html,
        css: css,
        js: js,
      });
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, html, css, js]);

  const onHtmlChange = (value) => {
    setHtml(value);
    notifyChange(value, "HTML");
  };

  const onCssChange = (value) => {
    setCss(value);
    notifyChange(value, "CSS");
  };

  const onJsChange = (value) => {
    setJs(value);
    notifyChange(value, "JS");
  };

  const notifyChange = (value, type) => {
    socket.emit("project_write", {
      data: value,
      room: projectID,
      type: type,
    });
  };

  useEffect(() => {
    if (socket == null) return;
    const project_read = ({ data, type }) => {
      switch (type) {
        case "HTML":
          setHtml(data);
          break;
        case "CSS":
          setCss(data);
          break;
        case "JS":
          setJs(data);
          break;
      }
    };

    const project_retrieve = (data) => {
      const jsonData = JSON.parse(data);
      setHtml(jsonData.html);
      setCss(jsonData.css);
      setJs(jsonData.js);
    };

    socket.on("project_read", project_read);
    socket.on("project_retrieved", project_retrieve);

    return () => {
      socket.off("project_read", project_read);
      socket.off("project_retrieved", project_retrieve);
    };
  }, [socket]);

  const handleLangChange = (e) => {
    setSelectedLang(e.target.value);
  };

  const getCodeEditorValue = () => {
    switch (selectedLang) {
      case "HTML":
        return html;
      case "CSS":
        return css;
      case "JavaScript":
        return js;
      default:
        return html;
    }
  };

  const handleEditorChange = (value) => {
    switch (selectedLang) {
      case "HTML":
        onHtmlChange(value);
        break;
      case "CSS":
        onCssChange(value);
        break;
      case "JavaScript":
        onJsChange(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="playground">
      <div>
        <label htmlFor="language-select">Select Language: </label>
        <select
          id="language-select"
          value={selectedLang}
          onChange={handleLangChange}
        >
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JavaScript">JavaScript</option>
        </select>
      </div>
      <CodeEditor
        name="Editor"
        lang={selectedLang.toLowerCase()}
        value={getCodeEditorValue()}
        handleChange={handleEditorChange}
      />
    </div>
  );
};