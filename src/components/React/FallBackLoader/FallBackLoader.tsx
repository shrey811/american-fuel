import React from "react";
import { BeatLoader } from 'react-spinners';

interface FallbackProps {
  h?: number;
  styles?: React.CSSProperties;
}

export default function FallbackLoader({ h, styles }: FallbackProps) {
  return (
    <div
      className="blinking"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        // height: (h ? h : 65) + "vh",
        // height: "100%",
        ...styles
      }}
    >
      <BeatLoader color="rgb(25, 118, 210)"/>
    </div>
  );
}
