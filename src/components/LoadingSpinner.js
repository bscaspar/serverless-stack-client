import React from "react";
import { Glyphicon } from "react-bootstrap";
import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return <Glyphicon glyph="refresh" className="spinning" />;
}
