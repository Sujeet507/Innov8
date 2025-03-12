import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfView = ({ fileUrl , setPdfView , title }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className="absolute w-[70vw] h-[90vh] translate-x-[-50%] left-[50%] z-[999]">
      <div className="pl-8 pr-3 w-full h-12 bg-black flex items-center justify-between">
        <div className="title text-white">
    {title}
        </div>
      <div className="rounded-full h-6 w-6 z-[9999] flex items-center justify-center cursor-pointer" onClick={() => setPdfView({isOpen: false, fileUrl: ""})}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-circle-x"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>
      </div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer defaultScale={1}
          fileUrl={fileUrl}
          plugins={[
            // Register plugins
            defaultLayoutPluginInstance,
          ]}
          theme={"dark"}
        />
      </Worker>
    </div>
  );
};

export default PdfView;
