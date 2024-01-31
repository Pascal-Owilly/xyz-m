import React from "react";

const Footer = () => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer-wrap p-4 card-box mt-4 main-container" style={{ bottom: 0 }}>
            Intellima SCM &copy;
          2023 - <a href="" target="_blank">{currentYear}</a>
        </div>
    );
};

export default Footer;
