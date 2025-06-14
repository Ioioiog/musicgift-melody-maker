
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  const isSafariDesktop = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  return isSafariDesktop || isIOSSafari;
};

export const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
};

export const supportsWebM = (): boolean => {
  if (typeof document === 'undefined') return false;
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
};
