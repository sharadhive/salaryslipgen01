import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const invoiceRef = useRef();
  const [logo, setLogo] = useState(null);
  const [form, setForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    clientName: "",
    clientAddress: "",
    basicAmount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const basic = parseFloat(form.basicAmount) || 0;
  const cgst = +(basic * 0.09).toFixed(2);
  const sgst = +(basic * 0.09).toFixed(2);
  const total = +(basic + cgst + sgst).toFixed(2);

  const downloadPDF = () => {
    html2canvas(invoiceRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif", overflowY: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <label>Upload Logo:</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
        </div>
        <div>
          <label>Invoice Number:</label>
          <input
            type="text"
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Invoice Date:</label>
          <input
            type="date"
            name="invoiceDate"
            value={form.invoiceDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Client Address:</label>
          <textarea
            name="clientAddress"
            value={form.clientAddress}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", minHeight: "60px" }}
          ></textarea>
        </div>
        <div>
          <label>Basic Amount (Rs.):</label>
          <input
            type="number"
            name="basicAmount"
            value={form.basicAmount}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div
        ref={invoiceRef}
        style={{
          border: "1px solid #000",
          padding: "20px",
          width: "100%",
          maxWidth: "800px",
          margin: "auto",
          backgroundColor: "white",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {logo && (
          <img src={logo} alt="logo" style={{ width: "150px", marginBottom: "10px" }} />
        )}
        <h2 style={{ textAlign: "center" }}>PAYMENT RECEIPT</h2>
        <p><strong>Invoice Number:</strong> {form.invoiceNumber}</p>
        <p><strong>Invoice Date:</strong> {form.invoiceDate}</p>
        <p><strong>GSTIN:</strong> 27APTPK2751C1ZT</p>
        <p><strong>Name:</strong> QUASTECH (Quorate Software Solutions & Technologies)</p>
        <p><strong>Address:</strong> 201, Anant Laxmi Chambers, Dada Patil Marg, Opp Waman Hari Pethe Jewellers, Thane Maharashtra 400602</p>
        <p><strong>Contact:</strong> 022-2540 7799 / 8422800381</p>

        <hr />
        <p><strong>Billed To:</strong> {form.clientName}</p>
        <p>{form.clientAddress}</p>

        <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Description</th>
              <th>Basic Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Fees Received of {form.clientName}</td>
              <td>{basic.toFixed(2)}</td>
              <td>{(basic + cgst + sgst).toFixed(2)}</td>
            </tr>
            <tr>
              <td></td>
              <td>CGST</td>
              <td></td>
              <td>{cgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td></td>
              <td>SGST</td>
              <td></td>
              <td>{sgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" style={{ textAlign: "right" }}><strong>Sub Total</strong></td>
              <td><strong>{total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: "20px" }}><strong>In Words:</strong> ₹{total.toLocaleString("en-IN")} Only</p>

        <h4 style={{ marginTop: "30px" }}>Payment Options</h4>
        <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
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
              <td>Name – QUASTECH | Acc. No. – 188905500298 | IFSC – ICIC0001889</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
