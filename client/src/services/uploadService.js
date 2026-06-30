import { request } from "./api";

export function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/uploads", { method: "POST", body: formData });
}

export function inspectFilesBatch(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return request("/files/inspect-batch", { method: "POST", body: formData });
}
