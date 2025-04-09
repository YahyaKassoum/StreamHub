import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd = () => {
  useEffect(() => {
    try {
      // Load the AdSense script
      const script = document.createElement('script');
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7888198940661703";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      // Initialize the ad
      script.onload = () => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      };
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  }, []);

  return (
    <div className="ad-container ">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7888198940661703"
        data-ad-slot="5548252839"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default GoogleAd;
