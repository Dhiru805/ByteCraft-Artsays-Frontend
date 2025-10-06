import React from "react";
import { Link } from "react-router-dom";

const Forbidden403 = () => {
  const styles = {
    html: {
      boxSizing: "border-box",
    },
    body: {
        margin: 0,
        padding: 0,
        fontFamily: '"Merriweather", serif',
        fontSize: "100%",
        lineHeight: "1.15",
        background: '#fff url("/DashboardAssets/assets/images/Error/texture.jpg") repeat 0 0',
        color: "#fff",
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
    wrapper: {
      position: "relative",
      maxWidth: "1298px",
      margin: "2em auto 0 auto",
      background: 'transparent url("/DashboardAssets/assets/images/Error/wood-fence.png") no-repeat center top 24em',
    },
    box: {
      maxWidth: "70%",
      minHeight: "600px",
      margin: "0 auto",
      padding: "1em",
      textAlign: "center",
      background: 'transparent url("/DashboardAssets/assets/images/Error/dog-family-colored-doodle-drawing.jpg") no-repeat top 10em center',
    },
    h1: {
      margin: "0 0 1rem 0",
      fontSize: "8em",
      textShadow: "0 0 6px #8b4d1a",
    },
    p: {
      marginBottom: "0.5em",
      fontSize: "1.75em",
      color: "#ea8a1a",
    },
    pFirst: {
      marginTop: "16em",
      textShadow: "none",
    },
    a: {
      borderBottom: "1px dashed #837256",
      fontStyle: "italic",
      textDecoration: "none",
      color: "#837256",
    },
    aHover: {
      textShadow: "0 0 3px #8b4d1a",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.wrapper}>
        <div style={styles.box}>
          <h1 style={styles.h1}>403</h1>
          <p style={{ ...styles.p, ...styles.pFirst }}>
          Oops! Looks like you don’t have permission to view this page
          </p>
          <p style={styles.p}>
            <Link  onClick={() => window.history.back()} style={styles.a}>
              Please, go back this way.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden403;
