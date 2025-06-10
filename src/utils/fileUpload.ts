import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = 'order-attachments';

/**
 * Upload a file to Supabase storage
 * @param file File to upload
 * @param addonKey Addon identifier
 * @param orderId Optional order ID
 * @returns Object containing the file URL and metadata
 */
export const uploadFile = async (
  file: File | Blob,
  addonKey: string,
  orderId?: string
): Promise<{
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  path: string;
}> => {
  try {
    // Generate a unique path for this file
    const fileExtension = file instanceof File 
      ? file.name.split('.').pop() 
      : determineExtensionFromBlob(file);
    
    const fileName = file instanceof File
      ? file.name
      : `recording-${new Date().toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
    
    // Create a unique path for the file: addonKey/orderId(if exists)/unique-id.ext
    const path = `${addonKey}/${orderId || 'temp'}/${uuidv4()}.${fileExtension}`;
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get the public URL for the file
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return {
      url: data.publicUrl,
      fileName,
      fileType: file.type,
      fileSize: file instanceof File ? file.size : file.size,
      path
    };
  } catch (error) {
    console.error('File upload utility error:', error);
    throw error;
  }
};

/**
 * Save file metadata to database for tracking
 */
export const saveFileMetadata = async (
  fileData: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    path: string;
  },
  addonKey: string,
  fieldName: string,
  orderId?: string
) => {
  try {
    if (!orderId) {
      // If no orderId yet, we'll just keep the file in storage
      // The metadata will be created when the order is submitted
      return;
    }

    const { error } = await supabase
      .from('order_attachments')
      .insert({
        order_id: orderId,
        addon_key: addonKey,
        field_name: fieldName,
        file_url: fileData.url,
        file_name: fileData.fileName,
        file_type: fileData.fileType,
        file_size: fileData.fileSize,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error saving file metadata:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving file metadata:', error);
  }
};

/**
 * Update temporary file paths to be associated with an order
 */
export const updateFilePathsForOrder = async (
  tempPaths: string[],
  orderId: string
) => {
  // This function would be used after order creation to update
  // temporary file paths with the actual order ID
  // Not implemented in the current version
};

/**
 * Try to determine the file extension from a Blob's type
 */
const determineExtensionFromBlob = (blob: Blob): string => {
  const mimeTypeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mp3': 'mp3',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'application/pdf': 'pdf',
    'text/plain': 'txt'
  };

  return mimeTypeToExt[blob.type] || 'bin';
};

/**
 * Process multiple files for upload
 */
export const uploadMultipleFiles = async (
  files: File[],
  addonKey: string,
  orderId?: string
): Promise<Array<{
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  path: string;
}>> => {
  const promises = files.map(file => uploadFile(file, addonKey, orderId));
  return Promise.all(promises);
};
