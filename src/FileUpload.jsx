import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";

import pdficon from "./assets/pdf.png";
import { Toaster, toast } from "react-hot-toast";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // If it's an image, generate a preview
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleChange = (e) => {
    setFileName(e.target.value);
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type;

    if (fileType.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-24 h-24 object-cover rounded shadow"
        />
      );
    } else if (fileType === "application/pdf") {
      return (
        <img
          src={pdficon}
          alt="Preview"
          className="w-24 h-24 object-cover rounded shadow"
        />
      );
    } else {
      // Generic file icon
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12h16M4 8h16M4 4h16"
          />
        </svg>
      );
    }
  };
  const clearFiles = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName("");
  };

  const handleUploadToSupabase = async () => {
    if (!selectedFile) return;

    const uniqueId = uuidv4();

    // Upload file to Storage
    const filePath = `user-uploads/${uniqueId}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user_uploads")
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error("Storage upload failed:", uploadError.message);
      toast.error("Upload Failed");
      return;
    }

    const { data } = await supabase.storage
      .from("user_uploads")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("user_uploads").insert([
      {
        file_id: uniqueId,
        file_title: selectedFile.name,
        project_title: fileName,
        file_url: data.publicUrl,
        status: "review",
      },
    ]);

    setFileName("");
    setPreviewUrl(null);
    setSelectedFile(null);
    if (insertError) {
      console.error("Insert error:", insertError.message);
      alert("Insert failed");
    } else {
      toast.success("Upload successful!");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };
  return (
    <>
      <div>
        <div className="container flex items-center justify-center min-h-screen mx-auto">
          <div className="card-container max-w-3xl">
            <div className="card-heading text-center flex flex-col items-center justify-center gap-2">
              <h1 className="text-3xl leading-8 font-medium text-white">
                Innov8 2025 – The Ultimate Product Challenge 🚀
              </h1>
              <h5 class="text-xl leading-4 font-normal text-white">
                Solve. Innovate. Disrupt.
              </h5>
            </div>
            <div className="card bg-white shadow-xl rounded-lg mt-6">
              <div className="card-body">
                <div className="file-upload-container">
                  <div className="file-upload-content flex flex-col items-center justify-center gap-3">
                    <div className="file-upload-icon flex flex-col items-center justify-center gap-3 relative">
                      {selectedFile ? (
                        getFileIcon()
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-[#282541]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                      {selectedFile && (
                        <img
                          src="https://img.icons8.com/ios/50/000000/delete-sign.png"
                          alt="delete"
                          className="absolute top-0 right-0 w-6 h-6 cursor-pointer bg-white text-red-600 rounded-full"
                          onClick={clearFiles}
                        />
                      )}
                    </div>
                    <h1 className="file-upload-heading text-center text-xl font-medium text-[teal]">
                      {selectedFile ? selectedFile.name : "Select A File"}
                      {selectedFile && (
                        <div className="flex flex-col gap-2 text-start mt-3">
                          <label className="text-[12px] text-teal-600 ">
                            Project Name
                          </label>
                          <input
                            type="text"
                            className="w-[2/4] p-2 border border-gray-300 rounded-md focus:outline-none focus:shadow-blue-200 text-black text-sm"
                            value={fileName}
                            onChange={handleChange}
                          />
                        </div>
                      )}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                      <label className="btn btn-primary bg-[teal] outline-none border-none shadow-purple-400 cursor-pointer">
                        <span>Choose File</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                        />
                      </label>
                      {selectedFile && (
                        <button
                          className="btn btn-primary bg-[teal] outline-none border-none shadow-purple-400 cursor-pointer"
                          onClick={handleUploadToSupabase}
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h4 className="text-center text-sm text-gray-500 mt-4">
              Note: Proposals should be submitted before 14th March , 6 P.M.
            </h4>
            <div className="flex justify-center pt-6">
            <a className="btn btn-primary bg-teal-600 outline-0 border-0" href="/proposals">View All Proposals</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
