const signalStrokeWidth = 2;
const signalTrackLength = Math.hypot(208, 208);

export function RhythmLines({ documentCount }: { documentCount: number }) {
  return (
    <div className="rhythm-lines" aria-hidden="true">
      <div className="rhythm-parallax">
        <svg viewBox="0 0 640 520" fill="none" className="rhythm-drawing">
          <g className="rhythm-secondary" stroke="currentColor" strokeWidth="1">
            <path d="M20 300H104L248 156H380L536 0" />
            <path d="M20 350H130L274 206H406L612 0" />
            <path d="M20 400H156L300 256H432L640 48" />
            <path d="M20 450H182L326 306H458L640 124" />
            <path d="M20 500H208L352 356H484L640 200" />
          </g>
          <path d="M20 400H156L300 256H432L640 48" stroke="currentColor" strokeWidth="1" className="rhythm-main" />
          <g stroke="currentColor" strokeWidth="1" className="rhythm-marks">
            <path d="M292 256H308M300 248V264M424 256H440M432 248V264" />
            <circle cx="156" cy="400" r="3" /><circle cx="484" cy="356" r="3" />
          </g>
          <path d="M522 166L546 142" stroke="#ff7a17" strokeWidth={signalStrokeWidth} />
          <g transform="translate(432 256) rotate(-45)">
            <svg width={signalTrackLength} height={signalStrokeWidth} y={-signalStrokeWidth / 2} overflow="hidden">
              <rect className="signal-runner" width={signalTrackLength * .16} height={signalStrokeWidth} />
            </svg>
          </g>
        </svg>
      </div>
      <div className="document-mark"><span>{String(documentCount).padStart(2, '0')}</span><span className="mono-label">DOCUMENTS</span></div>
      <span className="drawing-index">LTYYB / DOCS</span>
    </div>
  );
}
