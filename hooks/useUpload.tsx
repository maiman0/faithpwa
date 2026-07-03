import { useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';

const MAX_BYTES = 1 * 1024 * 1024; // 1MB
const ALLOWED: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'application/pdf': ['pdf'],
};

const getExt = (nameOrUri: string) => {
  const m = nameOrUri.split('?')[0].split('#')[0].split('.'); // strip query/hash
  return (m.length > 1 ? m.pop() : '')?.toLowerCase() || '';
};

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '_');

export type UploadedDocument = {
  uri: string;
  name: string;
  type: string;
  refNo?: string;
};

export function useUpload() {
  const [attachedDocument, setAttachedDocument] = useState<UploadedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentRefNo, setDocumentRefNo] = useState<string>('');

  const generateUniqueFileName = (prefix: string, originalName: string, mime?: string) => {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const extFromName = getExt(originalName);
    const allowedExts = mime && ALLOWED[mime] ? ALLOWED[mime] : [];
    const ext = allowedExts.includes(extFromName) ? extFromName : allowedExts[0] || 'bin';
    return `${prefix}_${rand}.${ext}`;
  };

  const convertToFileUri = async (contentUri: string) => {
    if (Platform.OS === 'web') return contentUri;
    // Always copy to our cache dir with a safe name
    const target = (FileSystem.cacheDirectory || '') + `DOC_${Date.now()}.bin`;
    try {
      await FileSystem.copyAsync({ from: contentUri, to: target });
      return target;
    } catch {
      return null;
    }
  };

  const ensurePermission = async (requestFn: () => Promise<ImagePicker.PermissionResponse>) => {
    const { status, canAskAgain } = await requestFn();
    if (status === 'granted') return true;
    if (!canAskAgain) await Linking.openSettings();
    setError("Permission denied. Please enable access in settings.");
    return false;
  };

  const pickFromGallery = async () => {
    const granted = await ensurePermission(ImagePicker.requestMediaLibraryPermissionsAsync);
    if (!granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileUri = await convertToFileUri(asset.uri);
      if (fileUri) {
        const mime = asset.mimeType || 'image/jpeg';
        const safeName = generateUniqueFileName('ATT', sanitize(asset.fileName || asset.uri), mime);
        const doc = { uri: fileUri, name: safeName, type: mime };
        setAttachedDocument(doc);
        return doc;
      }
    }
    return null;
  };

  const pickFromCamera = async () => {
    const granted = await ensurePermission(ImagePicker.requestCameraPermissionsAsync);
    if (!granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileUri = await convertToFileUri(asset.uri);
      if (fileUri) {
        const mime = asset.mimeType || 'image/jpeg';
        const safeName = generateUniqueFileName('ATT', sanitize(asset.fileName || asset.uri), mime);
        const doc = { uri: fileUri, name: safeName, type: mime };
        setAttachedDocument(doc);
        return doc;
      }
    }
    return null;
  };

  const pick = async () => {
    setError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets.length) return null;

      const file = result.assets[0];
      const fileUri = await convertToFileUri(file.uri);
      if (fileUri) {
        const mime = file.mimeType || 'application/octet-stream';
        
        // Validation logic
        if (!ALLOWED[mime]) {
          setError("Unsupported file type. Please upload a JPG, PNG or PDF.");
          return null;
        }
        let fileSize = file.size;
        if (fileSize === undefined && Platform.OS !== 'web') {
          const info = await FileSystem.getInfoAsync(fileUri);
          if (info.exists && typeof info.size === 'number') fileSize = info.size;
        }
        if (fileSize !== undefined && fileSize > MAX_BYTES) {
          setError("File is too large. Maximum size is 1MB.");
          return null;
        }

        const safeName = generateUniqueFileName('ATT', sanitize(file.name || file.uri), mime);
        const doc = { uri: fileUri, name: safeName, type: mime };
        setAttachedDocument(doc);
        return doc;
      }
    } catch (err) {
      setError("Failed to pick document");
      console.error(err);
    }
    return null;
  };

  return {
    attachedDocument,
    setAttachedDocument,
    documentRefNo,
    setDocumentRefNo,
    error,
    setError,
    pick,
    pickFromGallery,
    pickFromCamera,
  };
}
