import { useRef } from "react";
import { MAX_FILES } from "../../constants/order";
import { useOrder } from "../../context/OrderContext";
import { useToast } from "../../context/ToastContext";
import {
  isAllowedFile,
  validateFileCount,
  formatFileSize,
} from "../../utils/fileValidation";
import { inspectFilesBatch } from "../../services/uploadService";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function UploadSection() {
  const { files, dispatch } = useOrder();
  const { addToast } = useToast();
  const inputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const incoming = Array.from(fileList);

    for (const file of incoming) {
      const countError = validateFileCount(files.length, 1);
      if (countError) {
        addToast(countError, "error");
        break;
      }

      if (!isAllowedFile(file)) {
        addToast("Only PDF, DOCX, and PPT files are allowed.", "error");
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      dispatch({
        type: "ADD_FILE",
        payload: {
          id,
          name: file.name,
          size: file.size,
          mimeType: file.type,
          pageCount: 0,
          uploadStatus: "inspecting",
          url: null,
          file,
        },
      });

      try {
        // Step 1: Inspect file to get page count
        const inspectRes = await inspectFilesBatch([file]);
        const fileInfo = inspectRes?.files?.[0] || inspectRes?.data?.files?.[0];
        const pageCount = fileInfo?.pageCount || 0;

        if (fileInfo?.error) {
          dispatch({
            type: "UPDATE_FILE",
            payload: { id, uploadStatus: "error" },
          });
          addToast(fileInfo.error, "error");
          continue;
        }

        dispatch({
          type: "UPDATE_FILE",
          payload: {
            id,
            pageCount,
            uploadStatus: "done",
          },
        });
      } catch (err) {
        dispatch({
          type: "UPDATE_FILE",
          payload: { id, uploadStatus: "error" },
        });
        addToast(err.message || "Upload failed.", "error");
      }
    }
  };

  return (
    <SectionWrapper
      id="upload"
      step="3"
      title="Upload Files"
      description="PDF, DOCX, or PPT — maximum 3 files." // Updated Max Files 5 to 3.
    >
      <Card
        className="border-2 border-dashed border-border hover:border-primary/50"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.ppt,.pptx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 16V4m0 0l-4 4m4-4l4 4"
                stroke="#CA8A04"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 18v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                stroke="#1F2937"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-text">
            Tap to upload or drag files here
          </p>
          <p className="mt-1 text-xs text-text-muted">
            PDF, DOCX, PPT up to 25MB
          </p>
        </div>
      </Card>

      <p className="mt-4 text-sm font-medium text-text">
        {files.length} / {MAX_FILES} Files Uploaded
      </p>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {file.name}
                </p>
                <p className="text-xs text-text-muted">
                  {formatFileSize(file.size)} · {file.pageCount} pages
                  {file.uploadStatus === "inspecting" && " · Inspecting…"}
                  {file.uploadStatus === "uploading" && " · Uploading…"}
                  {file.uploadStatus === "error" && " · Upload failed"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  dispatch({ type: "REMOVE_FILE", payload: file.id })
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <p className="mt-3 text-sm text-text-muted">
          Total pages:{" "}
          <span className="font-semibold text-text">
            {files.reduce((s, f) => s + (f.pageCount || 0), 0)}
          </span>
        </p>
      )}
    </SectionWrapper>
  );
}
