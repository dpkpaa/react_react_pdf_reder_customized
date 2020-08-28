import React from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js`;

import ReactTooltip from "react-tooltip";
import Loader from "react-loader-spinner";
const PDFError = () => {
  return (
    <div className="pdf-fallback">
      <h1 className="error">Document Loading Failed!</h1>
    </div>
  );
};
const PDFNotFound = () => {
  return (
    <div className="pdf-fallback">
      <h1 className="error">Document Not Found!</h1>
    </div>
  );
};
const PDFLoading = () => {
  return (
    <div className="pdf-fallback">
      <span>
        <Loader type="RevolvingDot" color="#00BFFF" height={100} width={100} />
        <p>Document loading... </p>
      </span>
    </div>
  );
};
//Main Component
const Viewer = ({ file }) => {
  const [next, setNext] = React.useState(false);
  const [previous, setPrevious] = React.useState(false);
  const [state, setState] = React.useState({
    numPages: null,
    pageNumber: 1,
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setState({ ...state, numPages: numPages });
  };

  const handlePreviousPage = () => {
    if (state.pageNumber === 1) {
      setPrevious(true);
    } else {
      setState({ ...state, pageNumber: state.pageNumber - 1 });
      setPrevious(false);
    }
  };
  const handleNextPage = () => {
    if (state.pageNumber === state.numPages) {
      setNext(true);
    } else {
      setState({ ...state, pageNumber: state.pageNumber + 1 });
      setNext(false);
      window.onNextPageChange(
        state.pageNumber,
        state.pageNumber + 1,
        state.numPages
      ); //Window callback
    }
  };

  React.useEffect(() => {
    if (state.pageNumber === 1) setPrevious(true);
    if (state.pageNumber < state.numPages) setNext(false);
    if (state.pageNumber === state.numPages) setNext(true);
    return () => {
      setPrevious(false);
    };
  }, [state.pageNumber]);
  return (
    <React.Fragment>
      <Document
        className="pdf-document"
        file={file}
        externalLinkTarget="_blank"
        error={<PDFError />}
        loading={<PDFLoading />}
        noData={<PDFNotFound />}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas"
      >
        <Page className="pdf-page" scale={1.3} pageNumber={state.pageNumber} />
        <div className="pdf-buttons">
          <button
            className="previous btn "
            disabled={previous}
            onClick={handlePreviousPage}
            data-tip="Previous"
            data-for="previous"
          >
            <i className="fa fa-angle-left"></i>
            <ReactTooltip id="previous" />
          </button>
          <button
            className="next btn "
            disabled={next}
            onClick={handleNextPage}
            data-tip="Next"
            data-for="next"
          >
            <i className="fa fa-angle-right"></i>
            <ReactTooltip id="next" />
          </button>
        </div>

        <div className="pdf-pagination">
          <p data-tip="Pages" data-for="pages">
            Page {state.pageNumber} of {state.numPages}
          </p>
          <ReactTooltip id="pages" />
        </div>
      </Document>
    </React.Fragment>
  );
};
Viewer.propTypes = {
  file: PropTypes.string.isRequired,
};
export default Viewer;
