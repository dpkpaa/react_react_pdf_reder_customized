import React from "react";
import ReactDOM from "react-dom";
import Viewer from "./components/Viewer";
const App = ({ document }) => {
  return <Viewer file={document} />;
};

const container = document.getElementById("pdf-viewer");
container.oncontextmenu = () => {
  return false;
}; //Disable right click context menu

const file = container.dataset.pdf;
ReactDOM.render(<App document={file} />, container);
