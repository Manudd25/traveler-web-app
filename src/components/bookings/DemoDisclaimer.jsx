/* eslint-disable react/prop-types */
import { DEMO_DISCLAIMER } from "../../data/constants";

export default function DemoDisclaimer({ className = "" }) {
  return (
    <p className={`trv-disclaimer ${className}`} role="note">
      <i className="fas fa-info-circle" aria-hidden="true" />
      {DEMO_DISCLAIMER}
    </p>
  );
}
