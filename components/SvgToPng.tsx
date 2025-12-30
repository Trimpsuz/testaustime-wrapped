'use client';

import { useEffect, useRef, useState } from 'react';
import { default as NextImage } from 'next/image';

export default function SvgToPng({ svgString, alt, setIsActive }: { svgString: string; alt: string; setIsActive: (isActive: boolean) => void }) {
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!svgString) return;

    (async () => {
      try {
        const svgDataUrl = `data:image/svg+xml;base64,${svgString}`;

        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = svgDataUrl;
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const pngUrl = URL.createObjectURL(await (await fetch(canvas.toDataURL('image/png'))).blob());
        setPngUrl(pngUrl);
      } catch (_) {}
    })();
  }, [svgString]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      {pngUrl && (
        <NextImage
          className="cursor-pointer"
          onClick={() => window.open(pngUrl, '_blank')}
          alt={alt}
          width={1080}
          height={1460}
          src={pngUrl}
          onMouseOver={() => {
            setIsActive(true);
          }}
          onMouseLeave={() => {
            setIsActive(false);
          }}
        />
      )}
    </>
  );
}
