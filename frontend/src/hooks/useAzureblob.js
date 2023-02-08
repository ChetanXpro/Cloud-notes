
import { BlobServiceClient } from "@azure/storage-blob";

const useAzureblob = () => {
  const blobServiceClient = new BlobServiceClient(import.meta.env.VITE_SERVICE);
  const pdfContainerClient = blobServiceClient.getContainerClient("pdf");
  const publicContainerClient = blobServiceClient.getContainerClient("public");
  const profileContainerClient =
    blobServiceClient.getContainerClient("profile");
  return {
    blobServiceClient,
    pdfContainerClient,
    profileContainerClient,
    publicContainerClient
  };
};

export default useAzureblob;
