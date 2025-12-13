import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © {year} KTECH. All rights reserved.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    width: "100%",
    padding: "12px 0",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #ddd",
    position: "relative",
    bottom: 0,
  },
  text: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
};

export default Footer;
