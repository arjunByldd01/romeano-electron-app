import React from "react";
import "../../index.css";
import { UI_COMPONENT_DATA_TEST_ID } from "../../lib/enums/ui.";
const Spinner = () => {
  return (
    <div
      data-testid={UI_COMPONENT_DATA_TEST_ID.SPINNER_COMPONENT}
      className="spinner center"
    >
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
    </div>
  );
};

export default Spinner;
