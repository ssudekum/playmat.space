import React from 'react';
import './Logo.css';

export const Logo = () => 
    <div className="logo-container">
        <span className="logo-text">
            MtG Zone
        </span>
        <div className="border top-left-border"></div>
        <div className="border top-right-border"></div>
        <div className="border left-border"></div>
        <div className="border bottom-border"></div>
        <div className="border right-border"></div>
    </div>

export default Logo;