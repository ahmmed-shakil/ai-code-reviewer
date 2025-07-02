import React, { useCallback, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../store/useStore";

const FileUpload = ({ onFileSelect }) => {
  const { addUploadedFile, removeUploadedFile, uploadedFiles } = useStore();
  const [dragActive, setDragActive] = useState(false);

  const supportedExtensions = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "py",
    "java",
    "cpp",
    "c",
    "cs",
    "php",
    "rb",
    "go",
    "rs",
    "swift",
    "kt",
    "scala",
    "html",
    "css",
    "scss",
    "sql",
    "sh",
    "yml",
    "yaml",
    "json",
    "xml",
  ];

  const handleFiles = useCallback(
    async (files) => {
      const validFiles = [];

      for (const file of files) {
        // Check file extension
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!supportedExtensions.includes(extension)) {
          toast.error(`Unsupported file type: ${file.name}`);
          continue;
        }

        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
          toast.error(`File too large: ${file.name} (max 1MB)`);
          continue;
        }

        try {
          const content = await readFileContent(file);
          const fileData = {
            name: file.name,
            content,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          };

          validFiles.push(fileData);
          addUploadedFile(fileData);
        } catch (error) {
          toast.error(`Failed to read file: ${file.name}`);
        }
      }

      if (validFiles.length > 0) {
        toast.success(`${validFiles.length} file(s) uploaded successfully`);

        // Auto-select the first uploaded file
        if (validFiles.length === 1 && onFileSelect) {
          onFileSelect(validFiles[0]);
        }
      }
    },
    [addUploadedFile, onFileSelect]
  );

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = [...e.dataTransfer.files];
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e) => {
      const files = [...e.target.files];
      if (files.length > 0) {
        handleFiles(files);
      }
      // Reset input
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemoveFile = (fileName) => {
    removeUploadedFile(fileName);
    toast.success("File removed");
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Drop your code files here
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          or click to browse and select files
        </p>

        <input
          type="file"
          multiple
          accept={supportedExtensions.map((ext) => `.${ext}`).join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Browse Files
        </button>
      </div>

      {/* Supported File Types */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Supported File Types
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
              {supportedExtensions.map((ext) => `.${ext}`).join(", ")}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
              Maximum file size: 1MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress or File List */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Uploaded Files ({uploadedFiles.length})
            </h4>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onFileSelect && onFileSelect(file)}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="text-red-600 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
