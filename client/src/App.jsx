import React, { useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Confetti from "react-confetti";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import "bootstrap/dist/css/bootstrap.min.css";
import SalarySlipGenerator from "./components/Salaryslipgen";
import logo from "./assets/logo-55 (2).png";
import Invoice from "./components/Invoice";

const App = () => {
  const [fireMoney, setFireMoney] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleClick = () => {
    setFireMoney(true);
    setTimeout(() => setFireMoney(false), 2000);
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "auto",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f2f9ff, #ffffff)",
        cursor: "pointer",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 35 },
            size: { value: 20 },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              outModes: "bounce",
            },
            shape: {
              type: "image",
              image: {
                src: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                width: 32,
                height: 32,
              },
            },
          },
        }}
        style={{
          position: "absolute",
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ repeat: Infinity, duration: 6 }}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, #00c6ff, transparent)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      <Tilt glareEnable glareMaxOpacity={0.2} scale={1.05} tiltMaxAngleX={15} tiltMaxAngleY={15}>
        <motion.img
          src={logo}
          alt="Quastech Logo"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            width: "320px",
            marginBottom: "30px",
            zIndex: 2,
            filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.2))",
          }}
        />
      </Tilt>

      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "backOut" }}
        style={{
          fontSize: "2.8rem",
          fontWeight: "bold",
          background: "linear-gradient(90deg, #007bff, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px",
        }}
      >
        💼 Salary Slip Generator
      </motion.h1>

      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{ display: "flex", gap: "10px", marginBottom: 20, zIndex: 2 }}
      >
        {["💵", "💴", "💶", "💷"].map((emoji, i) => (
          <motion.div
            key={i}
            animate={{ rotateX: [0, 30, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
            style={{ fontSize: "2.5rem", transformStyle: "preserve-3d" }}
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "35px",
          width: "90%",
          maxWidth: "1000px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          zIndex: 2,
        }}
      >
        {showInvoice ? <Invoice /> : <SalarySlipGenerator />}
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{ marginTop: "40px", textAlign: "center", zIndex: 2 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInvoice(!showInvoice)}
          style={{
            marginRight: "20px",
            padding: "14px 28px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(45deg, #28a745, #218838)",
            border: "none",
            borderRadius: "30px",
            boxShadow: "0 8px 20px rgba(40,167,69,0.3)",
            cursor: "pointer",
          }}
        >
          🧾 {showInvoice ? "Back to Salary Slip" : "Generate Invoice"}
        </motion.button>

        <motion.a
          href="https://attendance.quastech.in/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(0,198,255,0.9)", boxShadow: "0px 0px 20px rgba(0,198,255,0.6)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            display: "inline-block",
            padding: "14px 28px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(45deg, #007bff, #00c6ff)",
            borderRadius: "30px",
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(0, 123, 255, 0.3)",
          }}
        >
          🚀 Go to Attendance Admin Panel
        </motion.a>
      </motion.div>

      <motion.div
        onMouseMove={handleClick}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      />
      {fireMoney && (
        <Confetti
          numberOfPieces={150}
          recycle={false}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          fontSize: "2.5rem",
          zIndex: 1,
        }}
      >
        💰💸💵
      </motion.div>
    </div>
  );
};

export default App;