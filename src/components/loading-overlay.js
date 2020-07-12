import React, { Component } from "react";
import Loader from "react-loader-spinner";

const LoadingOverlay = props => (
    <div className="loading-overlay">
        <Loader type="TailSpin" color="#FFF" height={100} width={100} />
    </div>
)

export default LoadingOverlay