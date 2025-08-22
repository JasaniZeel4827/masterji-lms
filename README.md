// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { FileRejection, useDropzone } from "react-dropzone";
// import { Card, CardContent } from "../ui/card";
// import { cn } from "@/lib/utils";
// import { RenderEmptyState, RenderErrorState, RenderUploadingState, RenderUploadState } from "./RenderState";
// import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid";
// // import { resend } from "@/lib/resend";
// import { resend } from "@/lib/resend";
// import { useConstructUrl } from "@/hooks/use-construct-url";
// // import { undefined } from "zod";
// // import { resolve } from "path";

// interface UploaderState {
//     id: string | null;
//     file: File | null;
//     uploading: boolean;
//     progress: number;
//     key?: string;
//     isDeleting: boolean;
//     error: boolean;
//     objectUrl: string;
//     fileType: "image" | "video";
// }


// // interface

// interface iAppProps {
//     value?: string;
//     onChange?: (value: string) => void;
// }

// // Helper function to safely construct a URL
// const getSafeUrl = (url: string): string | null => {
//   if (!url) return null;

//   // If it's already a full URL, return as is
//   if (url.startsWith('http')) {
//     try {
//       new URL(url);
//       return url;
//     } catch {
//       return null;
//     }
//   }

//   // Otherwise, try to construct with base URL
//   const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || '';
//   if (!baseUrl) return null;

//   // Remove any leading/trailing slashes for clean concatenation
//   const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
//   const cleanPath = url.startsWith('/') ? url.slice(1) : url;

//   try {
//     const fullUrl = `${cleanBase}/${cleanPath}`;
//     new URL(fullUrl); // Validate the constructed URL
//     return fullUrl;
//   } catch {
//     return null;
//   }
// };

// export function Uploader({ onChange, value }: iAppProps) {
//     const [fileState, setFileState] = useState<UploaderState>(() => ({
//         error: false,
//         file: null,
//         id: null,
//         uploading: false,
//         progress: 0,
//         isDeleting: false,
//         fileType: "image",
//         objectUrl: getSafeUrl(value || '') || "",
//         key: value || "",
//     }));

//     // Clean up object URLs when component unmounts or when they're no longer needed
//     useEffect(() => {
//         return () => {
//             if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
//                 URL.revokeObjectURL(fileState.objectUrl);
//             }
//         };
//     }, [fileState.objectUrl]);

//     useEffect(() => {
//         if (value && value !== fileState.key) {
//             const newUrl = getSafeUrl(value);

//             if (newUrl) {
//                 setFileState(prev => ({
//                     ...prev,
//                     objectUrl: newUrl,
//                     key: value,
//                     error: false
//                 }));
//             } else {
//                 console.error('Failed to construct valid URL for value:', value);
//                 setFileState(prev => ({
//                     ...prev,
//                     objectUrl: "",
//                     key: "",
//                     error: true
//                 }));
//             }
//         } else if (!value && fileState.key) {
//             // Clear the preview if value is removed
//             setFileState(prev => ({
//                 ...prev,
//                 objectUrl: "",
//                 key: "",
//                 error: false
//             }));
//         }
//     }, [value]);

//     async function uploadFile(file: File) {
//         setFileState((prev) => ({
//             ...prev,
//             uploading: true,
//             progress: 0,
//         }));

//         try {
//             console.log('Starting upload process for file:', file.name);

//             // 1. First get the presigned URL from your API
//             console.log('Requesting presigned URL...');
//             const presignedResponse = await fetch("/api/s3/upload", {
//                 method: "POST",
//                 headers: { 
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     fileName: file.name,
//                     contentType: file.type,
//                     size: file.size,
//                     isImage: true,
//                 }),
//             });

//             if (!presignedResponse.ok) {
//                 const errorText = await presignedResponse.text();
//                 console.error('Failed to get presigned URL:', presignedResponse.status, errorText);
//                 let errorMessage = 'Failed to get upload URL';
//                 try {
//                     const errorData = JSON.parse(errorText);
//                     errorMessage = errorData.error || errorMessage;
//                 } catch (e) {}
//                 throw new Error(errorMessage);
//             }

//             const { presignedUrl, key } = await presignedResponse.json();
//             console.log('Received presigned URL:', presignedUrl);

//             if (!presignedUrl || !key) {
//                 console.error('Invalid response from server - missing presignedUrl or key');
//                 throw new Error('Invalid server response');
//             }

//             // 2. Upload the file to S3 using the presigned URL
//             console.log('Uploading file to S3...');
//             const uploadResponse = await fetch(presignedUrl, {
//                 method: "PUT",
//                 body: file,
//                 headers: {
//                     'Content-Type': file.type,
//                     'Cache-Control': 'public, max-age=31536000',
//                 },
//             });

//             console.log('Upload response status:', uploadResponse.status);

//             if (!uploadResponse.ok) {
//                 const errorText = await uploadResponse.text();
//                 console.error('Upload failed:', uploadResponse.status, errorText);
//                 throw new Error('Failed to upload file to storage');
//             }

//             console.log('File uploaded successfully, key:', key);

//             // 3. Update the state and call the onChange callback
//             setFileState(prev => ({
//                 ...prev,
//                 progress: 100,
//                 uploading: false,
//                 key,
//                 error: false,
//             }));

//             // Call the parent component's onChange with the file key
//             onChange?.(key);
//             toast.success("File uploaded successfully");

//         } catch (error) {
//             console.error("Upload error:", error);
//             const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
//             toast.error(errorMessage);
//             setFileState(prev => ({
//                 ...prev,
//                 uploading: false,
//                 error: true,
//                 progress: 0,
//             }));
//         }
//     };

//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         if (acceptedFiles.length === 0) return;

//         const file = acceptedFiles[0];
//         console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);

//         // Only revoke object URL if it's a blob URL (starts with 'blob:')
//         if (fileState.objectUrl && fileState.objectUrl.startsWith('blob:')) {
//             URL.revokeObjectURL(fileState.objectUrl);
//         }

//         // Validate file type
//         if (!file.type.startsWith('image/')) {
//             toast.error('Only image files are allowed');
//             return;
//         }

//         // Validate file size (5MB max)
//         const maxSize = 5 * 1024 * 1024; // 5MB
//         if (file.size > maxSize) {
//             toast.error('File size must be less than 5MB');
//             return;
//         }

//         // Create object URL for preview
//         const objectUrl = URL.createObjectURL(file);

//         setFileState({
//             file,
//             uploading: false,
//             progress: 0,
//             objectUrl,
//             id: uuidv4(),
//             isDeleting: false,
//             fileType: "image",
//             error: false,
//             key: undefined, // Clear the existing key when a new file is selected
//         });

//         // Start the upload process
//         uploadFile(file);

//     }, [fileState.objectUrl]);

//     async function handleRemoveFile() {
//         if (fileState.isDeleting || !fileState.objectUrl)
//             return;
//         try {
//             setFileState((prev) => ({
//                 ...prev,
//                 isDeleting: true,
//             }));

//             const response = await fetch('/api/s3/delete', {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     key: fileState.key,
//                 })
//             });

//             if (!response.ok) {
//                 toast.error('Failed to remove file from database');
//                 setFileState((prev) => ({
//                     ...prev,
//                     isDeleting: false,
//                     error: true,
//                 }));

//                 return;
//             }

//             if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
//                 URL.revokeObjectURL(fileState.objectUrl);
//             }

//             setFileState({
//                 file: null,
//                 uploading: false,
//                 progress: 0,
//                 objectUrl: "",
//                 error: false,
//                 fileType: 'image',
//                 id: null,
//                 isDeleting: false,
//             });

//             toast.success('File removed successfully')
//         } catch {
//             toast.error('Error removing file, please try again')
//             setFileState((prev) => ({
//                 ...prev,
//                 isDeleting: false,
//                 error: true,
//             }));
//         }
//     }

//     function rejectedFiles(fileRejection: FileRejection[]) {
//         if (fileRejection.length) {
//             const tooManyFiles = fileRejection.find((r) => r.errors[0].code === "too-many-files");
//             const fileSizeTooBig = fileRejection.find((r) => r.errors[0].code === "file-too-large");

//             if (fileSizeTooBig) toast.error("File size limit exceeds");
//             if (tooManyFiles) toast.error("Too many files selected, max is 1");
//         }
//     }

//     const renderContent = () => {
//         if (fileState.uploading && fileState.file) {
//             return <RenderUploadingState file={fileState.file} progress={fileState.progress} />;
//         }
//         if (fileState.error) {
//             return <RenderErrorState />;
//         }

//         // Only show the uploaded image if we have a valid objectUrl and a file or key
//         if (fileState.objectUrl && (fileState.file || fileState.key)) {
//             return (
//                 <RenderUploadState
//                     previewUrl={fileState.objectUrl}
//                     isDeleting={fileState.isDeleting}
//                     handleRemoveFile={handleRemoveFile}
//                 />
//             );
//         }

//         // Default to empty state when no file is selected
//         return <RenderEmptyState isDragActive={isDragActive} />;
//     };

//     useEffect(() => {
//         return () => {
//             if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
//                 URL.revokeObjectURL(fileState.objectUrl);
//             }
//         };
//     }, [fileState.objectUrl]);

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: { "image/*": [] },
//         maxFiles: 1,
//         multiple: false,
//         maxSize: 5 * 1024 * 1024,
//         onDropRejected: rejectedFiles,
//         disabled: fileState.uploading || !!fileState.objectUrl,
//     });

//     return (
//         <Card
//             {...getRootProps()}
//             className={cn(
//                 "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
//                 isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
//             )}
//         >
//             <CardContent className="flex items-center justify-center h-full w-full p-4">
//                 <input {...getInputProps()} />
//                 {renderContent()}
//             </CardContent>
//         </Card>
//     );
// }






// "use client";



// import { useCallback } from "react";
// import { useDropzone } from "react-dropzone";

// export function Uploader() {


//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         console.log(acceptedFiles)
//     }, []);

// }
// const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
// return (
//     <div{...getRootProps()}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//             <p>Drop the file here</p>
//         ) : (
//             <p>Drag your course image here, click to select the image</p>
//         )}
//     </div>
// )








"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";
// import { uuidv4 } from "zod";



interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl: string;
    fileType: "image" | "video";
}




export function Uploader() {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });


    function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

    }
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0]

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image"
            })
        }
        console.log(acceptedFiles)
    }, []);

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === "too-many-files");
            const fileSizeTooBig = fileRejection.find(
                (rejection) => rejection.errors[0].code === "file-too-large"
            );

            if (fileSizeTooBig) {
                toast.error("file size limit exceeds");
            }

            if (tooManyFiles) {
                toast.error("Too many files selected, max is 1");
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDropRejected: rejectedFiles,
    });

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary'
        )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    );
}




// code for backup







































// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { FileRejection, useDropzone } from "react-dropzone";
// import { Card, CardContent } from "../ui/card";
// import { cn } from "@/lib/utils";
// import { RenderEmptyState, RenderErrorState, RenderUploadingState, RenderUploadState } from "./RenderState";
// import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid";
// // import { resend } from "@/lib/resend";
// import { resend } from "@/lib/resend";
// import { useConstructUrl } from "@/hooks/use-construct-url";
// // import { undefined } from "zod";
// // import { resolve } from "path";

// interface UploaderState {
//     id: string | null;
//     file: File | null;
//     uploading: boolean;
//     progress: number;
//     key?: string;
//     isDeleting: boolean;
//     error: boolean;
//     objectUrl: string;
//     fileType: "image" | "video";
// }


// // interface

// interface iAppProps {
//     value?: string;
//     onChange?: (value: string) => void;
// }

// // Helper function to safely construct a URL
// const getSafeUrl = (url: string): string | null => {
//   if (!url) return null;

//   // If it's already a full URL, return as is
//   if (url.startsWith('http')) {
//     try {
//       new URL(url);
//       return url;
//     } catch {
//       return null;
//     }
//   }

//   // Otherwise, try to construct with base URL
//   const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || '';
//   if (!baseUrl) return null;

//   // Remove any leading/trailing slashes for clean concatenation
//   const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
//   const cleanPath = url.startsWith('/') ? url.slice(1) : url;

//   try {
//     const fullUrl = `${cleanBase}/${cleanPath}`;
//     new URL(fullUrl); // Validate the constructed URL
//     return fullUrl;
//   } catch {
//     return null;
//   }
// };

// export function Uploader({ onChange, value }: iAppProps) {
//     const [fileState, setFileState] = useState<UploaderState>(() => ({
//         error: false,
//         file: null,
//         id: null,
//         uploading: false,
//         progress: 0,
//         isDeleting: false,
//         fileType: "image",
//         objectUrl: getSafeUrl(value || '') || "",
//         key: value || "",
//     }));

//     // Clean up object URLs when component unmounts or when they're no longer needed
//     useEffect(() => {
//         return () => {
//             if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
//                 URL.revokeObjectURL(fileState.objectUrl);
//             }
//         };
//     }, [fileState.objectUrl]);

//     useEffect(() => {
//         if (value && value !== fileState.key) {
//             const newUrl = getSafeUrl(value);

//             if (newUrl) {
//                 setFileState(prev => ({
//                     ...prev,
//                     objectUrl: newUrl,
//                     key: value,
//                     error: false
//                 }));
//             } else {
//                 console.error('Failed to construct valid URL for value:', value);
//                 setFileState(prev => ({
//                     ...prev,
//                     objectUrl: "",
//                     key: "",
//                     error: true
//                 }));
//             }
//         } else if (!value && fileState.key) {
//             // Clear the preview if value is removed
//             setFileState(prev => ({
//                 ...prev,
//                 objectUrl: "",
//                 key: "",
//                 error: false
//             }));
//         }
//     }, [value]);

//     async function uploadFile(file: File) {
//         setFileState((prev) => ({
//             ...prev,
//             uploading: true,
//             progress: 0,
//         }));

//         try {
//             console.log('Starting upload process for file:', file.name);

//             // 1. First get the presigned URL from your API
//             console.log('Requesting presigned URL...');
//             const presignedResponse = await fetch("/api/s3/upload", {
//                 method: "POST",
//                 headers: { 
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     fileName: file.name,
//                     contentType: file.type,
//                     size: file.size,
//                     isImage: true,
//                 }),
//             });

//             if (!presignedResponse.ok) {
//                 const errorText = await presignedResponse.text();
//                 console.error('Failed to get presigned URL:', presignedResponse.status, errorText);
//                 let errorMessage = 'Failed to get upload URL';
//                 try {
//                     const errorData = JSON.parse(errorText);
//                     errorMessage = errorData.error || errorMessage;
//                 } catch (e) {}
//                 throw new Error(errorMessage);
//             }

//             const { presignedUrl, key } = await presignedResponse.json();
//             console.log('Received presigned URL:', presignedUrl);

//             if (!presignedUrl || !key) {
//                 console.error('Invalid response from server - missing presignedUrl or key');
//                 throw new Error('Invalid server response');
//             }

//             // 2. Upload the file to S3 using the presigned URL
//             console.log('Uploading file to S3...');
//             const uploadResponse = await fetch(presignedUrl, {
//                 method: "PUT",
//                 body: file,
//                 headers: {
//                     'Content-Type': file.type,
//                     'Cache-Control': 'public, max-age=31536000',
//                 },
//             });

//             console.log('Upload response status:', uploadResponse.status);

//             if (!uploadResponse.ok) {
//                 const errorText = await uploadResponse.text();
//                 console.error('Upload failed:', uploadResponse.status, errorText);
//                 throw new Error('Failed to upload file to storage');
//             }

//             console.log('File uploaded successfully, key:', key);

//             // 3. Update the state and call the onChange callback
//             setFileState(prev => ({
//                 ...prev,
//                 progress: 100,
//                 uploading: false,
//                 key,
//                 error: false,
//             }));

//             // Call the parent component's onChange with the file key
//             onChange?.(key);
//             toast.success("File uploaded successfully");

//         } catch (error) {
//             console.error("Upload error:", error);
//             const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
//             toast.error(errorMessage);
//             setFileState(prev => ({
//                 ...prev,
//                 uploading: false,
//                 error: true,
//                 progress: 0,
//             }));
//         }
//     };

//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         if (acceptedFiles.length === 0) return;

//         const file = acceptedFiles[0];
//         console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);

//         // Only revoke object URL if it's a blob URL (starts with 'blob:')
//         if (fileState.objectUrl && fileState.objectUrl.startsWith('blob:')) {
//             URL.revokeObjectURL(fileState.objectUrl);
//         }

//         // Validate file type
//         if (!file.type.startsWith('image/')) {
//             toast.error('Only image files are allowed');
//             return;
//         }

//         // Validate file size (5MB max)
//         const maxSize = 5 * 1024 * 1024; // 5MB
//         if (file.size > maxSize) {
//             toast.error('File size must be less than 5MB');
//             return;
//         }

//         // Create object URL for preview
//         const objectUrl = URL.createObjectURL(file);

//         setFileState({
//             file,
//             uploading: false,
//             progress: 0,
//             objectUrl,
//             id: uuidv4(),
//             isDeleting: false,
//             fileType: "image",
//             error: false,
//             key: undefined, // Clear the existing key when a new file is selected
//         });

//         // Start the upload process
//         uploadFile(file);

//     }, [fileState.objectUrl]);

//     async function handleRemoveFile() {
//         if (fileState.isDeleting || !fileState.objectUrl)
//             return;
//         try {
//             setFileState((prev) => ({
//                 ...prev,
//                 isDeleting: true,
//             }));

//             const response = await fetch('/api/s3/delete', {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     key: fileState.key,
//                 })
//             });

//             if (!response.ok) {
//                 toast.error('Failed to remove file from database');
//                 setFileState((prev) => ({
//                     ...prev,
//                     isDeleting: false,
//                     error: true,
//                 }));

//                 return;
//             }

//             if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
//                 URL.revokeObjectURL(fileState.objectUrl);
//             }

//             setFileState({
//                 file: null,
//                 uploading: false,
//                 progress: 0,
//                 objectUrl: "",
//                 error: false,
//                 fileType: 'image',
//                 id: null,
//                 isDeleting: false,
//             });

//             toast.success('File removed successfully')
//         } catch {
//             toast.error('Error removing file, please try again')
//             setFileState((prev) => ({
//                 ...prev,
//                 isDeleting: false,
//                 error: true,
//             }));
//         }
//     }

//     function rejectedFiles(fileRejection: FileRejection[]) {
//         if (fileRejection.length) {
//             const tooManyFiles = fileRejection.find((r) => r.errors[0].code === "too-many-files");
//             const fileSizeTooBig = fileRejection.find((r) => r.errors[0].code === "file-too-large");

//             if (fileSizeTooBig) toast.error("File size limit exceeds");
//             if (tooManyFiles) toast.error("Too many files selected, max is 1");
//         }
//     }

//     const renderContent = () => {
//         if (fileState.uploading && fileState.file) {
//             return <RenderUploadingState file={fileState.file} progress={fileState.progress} />;
//         }
//         if (fileState.error) {
//             return <RenderErrorState />;
//         }

//         // Only show the uploaded image if we have a valid objectUrl and a file or key
//         if (fileState.objectUrl && (fileState.file || fileState.key)) {
//             return (
//                 <RenderUploadState
//                     previewUrl={fileState.objectUrl}
//                     isDeleting={fileState.isDeleting}
//                     handleRemoveFile={handleRemoveFile}
//                 />
//             );
//         }

//         // Default to empty state when no file is selected
//         return <RenderEmptyState isDragActive={isDragActive} />;
//     };

//     useEffect(() => {
//         return () => {
//             if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
//                 URL.revokeObjectURL(fileState.objectUrl);
//             }
//         };
//     }, [fileState.objectUrl]);

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: { "image/*": [] },
//         maxFiles: 1,
//         multiple: false,
//         maxSize: 5 * 1024 * 1024,
//         onDropRejected: rejectedFiles,
//         disabled: fileState.uploading || !!fileState.objectUrl,
//     });

//     return (
//         <Card
//             {...getRootProps()}
//             className={cn(
//                 "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
//                 isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
//             )}
//         >
//             <CardContent className="flex items-center justify-center h-full w-full p-4">
//                 <input {...getInputProps()} />
//                 {renderContent()}
//             </CardContent>
//         </Card>
//     );
// }






// "use client";



// import { useCallback } from "react";
// import { useDropzone } from "react-dropzone";

// export function Uploader() {


//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         console.log(acceptedFiles)
//     }, []);

// }
// const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
// return (
//     <div{...getRootProps()}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//             <p>Drop the file here</p>
//         ) : (
//             <p>Drag your course image here, click to select the image</p>
//         )}
//     </div>
// )








"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// import { uuidv4 } from "zod";



interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl: string;
    fileType: "image" | "video";
}




export function Uploader() {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });


    function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {

        } catch {

        }

    }
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0]

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image"
            })
        }
        console.log(acceptedFiles)
    }, []);

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === "too-many-files");
            const fileSizeTooBig = fileRejection.find(
                (rejection) => rejection.errors[0].code === "file-too-large"
            );

            if (fileSizeTooBig) {
                toast.error("file size limit exceeds");
            }

            if (tooManyFiles) {
                toast.error("Too many files selected, max is 1");
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDropRejected: rejectedFiles,
    });

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary'
        )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    );
}