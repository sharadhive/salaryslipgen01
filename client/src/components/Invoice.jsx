import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import { toWords } from "number-to-words";

const Invoice = () => {
  const invoiceRef = useRef();
  const [logo, setLogo] = useState(null);
  const [form, setForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    clientName: "",
    clientAddress: "",
    subTotal: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, invoiceDate: today }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const total = parseFloat(form.subTotal) || 0;
  const basicAmount = +(total / 1.18).toFixed(2);
  const cgst = +(basicAmount * 0.09).toFixed(2);
  const sgst = +(basicAmount * 0.09).toFixed(2);
  const totalInWords = total
    ? `${toWords(total).replace(/\b\w/g, (c) => c.toUpperCase())} Rupees Only`
    : "";

  const downloadPDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin: 0.5,
      filename: `Invoice-${form.invoiceNumber || "QUASTECH"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
        flexWrap: "wrap",
        justifyContent: "center",
        background: "#f8fbff",
      }}
    >
      {/* LEFT FORM */}
      <div style={{ flex: "1", minWidth: "300px", maxWidth: "400px" }}>
        <h4 style={{ fontWeight: "bold", color: "#007bff" }}>
          Invoice Generator
        </h4>
        <label>Upload Company Logo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="form-control mb-3"
        />
        <label>Invoice Number:</label>
        <input
          type="text"
          name="invoiceNumber"
          value={form.invoiceNumber}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <label>Invoice Date:</label>
        <input
          type="date"
          name="invoiceDate"
          value={form.invoiceDate}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <label>Client Name:</label>
        <input
          type="text"
          name="clientName"
          value={form.clientName}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <label>Client Address:</label>
        <textarea
          name="clientAddress"
          value={form.clientAddress}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <label>Total Amount Received (₹ incl. GST):</label>
        <input
          type="number"
          name="subTotal"
          value={form.subTotal}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <button
          onClick={downloadPDF}
          className="btn btn-primary w-100"
          style={{ fontWeight: "bold", padding: "10px" }}
        >
          Download PDF
        </button>
      </div>

      {/* RIGHT INVOICE PREVIEW */}
      <div
        ref={invoiceRef}
        style={{
          flex: "1.5",
          minWidth: "350px",
          border: "1px solid #007bff",
          padding: "25px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0,123,255,0.1)",
        }}
      >
        {logo && (
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "150px", marginBottom: "20px" }}
          />
        )}
        <h2
          style={{
            textAlign: "center",
            color: "#007bff",
            marginBottom: "20px",
          }}
        >
          PAYMENT RECEIPT
        </h2>

        <p>
          <strong>Invoice Number:</strong> {form.invoiceNumber}
        </p>
        <p>
          <strong>Invoice Date:</strong> {form.invoiceDate}
        </p>
        <p>
          <strong>GSTIN:</strong> 27APTPK2751C1ZT
        </p>
        <p>
          <strong>Name:</strong> QUASTECH (Quorate Software Solutions &
          Technologies)
        </p>
        <p>
          <strong>Address:</strong> 201, Anant Laxmi Chambers, Dada Patil Marg,
          Opp Waman Hari Pethe Jewellers, Thane Maharashtra 400602
        </p>
        <p>
          <strong>Contact:</strong> 022-2540 7799 / 8422800381
        </p>

        <hr />

        <p>
          <strong>Billed To:</strong> {form.clientName}
        </p>
        <p>{form.clientAddress}</p>

        <table
          width="100%"
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            marginTop: 20,
            fontSize: "15px",
          }}
        >
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th>Sr. No</th>
              <th>Description</th>
              <th>Basic Amount (₹)</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Fees Received of {form.clientName}</td>
              <td>{basicAmount.toFixed(2)}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>CGST (9%)</td>
              <td></td>
              <td>{cgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td></td>
              <td>SGST (9%)</td>
              <td></td>
              <td>{sgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total Paid
              </td>
              <td style={{ fontWeight: "bold" }}>{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {totalInWords && (
          <p style={{ marginTop: "20px", fontStyle: "italic" }}>
            <strong>In Words:</strong> ₹{totalInWords}
          </p>
        )}

        <h4 style={{ marginTop: "30px", color: "#007bff" }}>Payment Options</h4>
        <table
          width="100%"
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", fontSize: "14px" }}
        >
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th>Payment Mode</th>
              <th>Bank Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CHEQUE</td>
              <td>ICICI Bank</td>
              <td>Favor of – QUASTECH</td>
            </tr>
            <tr>
              <td>NEFT</td>
              <td>ICICI Bank</td>
              <td>
                Name – QUASTECH | Acc. No. – 188905500298 | IFSC – ICIC0001889
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
