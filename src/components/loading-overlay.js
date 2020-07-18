import React, { Component } from "react";
import Loader from "react-loader-spinner";
import AppStore from "../stores/app"

const LoadingOverlay = () => (
    <div className="loading-overlay">
        <Loader type="TailSpin" color="#FFF" height={100} width={100} />
        <div className="loading-text">{AppStore.loadingMessage}</div>
    </div>
)

export default LoadingOverlay