/**
 * Optimizes a Cloudinary URL by adding auto quality and auto format parameters.
 * @param url The original Cloudinary URL
 * @returns The optimized URL
 */
export const optimizeCloudinaryUrl = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // If already optimized, return as is
  if (url.includes('q_auto,f_auto')) return url;
  
  // Insert q_auto,f_auto after /upload/
  return url.replace('/upload/', '/upload/q_auto,f_auto/');
};
