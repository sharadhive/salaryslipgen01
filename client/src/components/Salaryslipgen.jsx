// SalarySlipGenerator.js
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const SalarySlipGenerator = () => {
  const [showSignatureLine, setShowSignatureLine] = useState(false);

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    email: "",
    branch: "",
    branchAddress: "",
    monthlySalary: "",
    absentDays: 0,
    halfDays: 0,
    ot: 0,
    incentives: 0,
    arrears: 0,
    otherEarning: 0,
    otherDeduction: 0,
    pf: 0,
    loan: 0,
    designation: "",
    department: "",
    fromDate: "",
    toDate: "",
    esicNo: "",
  });
  const [signature, setSignature] = useState(null);
  const [logo, setLogo] = useState(null);
  const [calc, setCalc] = useState(null);

  const branchAddresses = {
    Mohali: "SCF 62, Third Floor, Phase 7, Sector 61, Mohali, Punjab - 160062",
    Thane:
      "201, Anant Laxmi Chambers, Dada Patil Marg, Opp. Waman Hari Pethe Jewellers, Thane (W) - 400602",
    Vashi: "F-185(A), Sector 30, Vashi, Navi Mumbai - 400703",
    Borivali: "A/401, Court Chamber, Borivali (W) - 400092",
  };

  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (num) => {
      if ((num = num.toString()).length > 9) return "Overflow";
      const n = ("000000000" + num)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return "";
      let str = "";
      str +=
        n[1] != 0
          ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
          : "";
      str +=
        n[2] != 0
          ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
          : "";
      str +=
        n[3] != 0
          ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "+""
          : "";
      str +=
        n[4] != 0
          ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
          : "";
      str +=
        n[5] != 0
          ? (str != "" ? "and " : "") +
            (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
            " "
          : "";
      return str.trim() + " Rupees Only/-";

    };

    return num ? inWords(num)  : "Zero";
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "branch") {
      setFormData({
        ...formData,
        branch: value,
        branchAddress: branchAddresses[value] || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e, setFunc) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFunc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCalculate = () => {
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const salary = parseFloat(formData.monthlySalary) || 0;
    const absentDays = parseFloat(formData.absentDays) || 0;
    const halfDays = parseFloat(formData.halfDays) || 0;
    const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;
    const salaryPerDay = salary / 30;
    const workingDays = totalDays - absentDays - halfDays / 2;
    const earnedSalary = salaryPerDay * workingDays;
    const basic = earnedSalary * 0.5;
    const hra = earnedSalary * 0.25;
    const special = earnedSalary * 0.125;
    const conveyance = earnedSalary * 0.125;
    const ot = parseFloat(formData.ot) || 0;
    const incentives = parseFloat(formData.incentives) || 0;
    const arrears = parseFloat(formData.arrears) || 0;
    const otherEarning = parseFloat(formData.otherEarning) || 0;
    const totalEarnings =
      basic +
      hra +
      special +
      conveyance +
      ot +
      incentives +
      arrears +
      otherEarning;
    const esic = salary < 21000 ? earnedSalary * 0.0175 : 0;
    const pt = 200;
    const mlwf = 0;
    const pf = parseFloat(formData.pf) || 0;
    const loan = parseFloat(formData.loan) || 0;
    const otherDeduction = parseFloat(formData.otherDeduction) || 0;
    const totalDeductions = esic + pt + mlwf + pf + loan + otherDeduction;
    const net = totalEarnings - totalDeductions;
    setCalc({
      totalDays,
      workingDays,
      salaryPerDay,
      earnedSalary,
      basic,
      hra,
      special,
      conveyance,
      ot,
      incentives,
      arrears,
      otherEarning,
      totalEarnings,
      esic,
      pf,
      loan,
      pt,
      mlwf,
      otherDeduction,
      totalDeductions,
      net,
      netWords: numberToWords(Math.round(net)),
    });
  };

  const handleGeneratePdf = () => {
    const element = document.getElementById("pdf-content");
    html2pdf().from(element).save(`${formData.employeeName}_SalarySlip.pdf`);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Generate Salary Slip
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Salary Slip Generator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Employee ID</Form.Label>
                  <Form.Control
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    as="select"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    {Object.keys(branchAddresses).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Monthly Salary (₹)</Form.Label>
                  <Form.Control
                    name="monthlySalary"
                    type="number"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>ESIC No</Form.Label>
                  <Form.Control
                    name="esicNo"
                    value={formData.esicNo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Absent Days</Form.Label>
                  <Form.Control
                    name="absentDays"
                    type="number"
                    value={formData.absentDays}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Half Days</Form.Label>
                  <Form.Control
                    name="halfDays"
                    type="number"
                    value={formData.halfDays}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>OT (₹)</Form.Label>
                  <Form.Control
                    name="ot"
                    type="number"
                    value={formData.ot}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Incentives (₹)</Form.Label>
                  <Form.Control
                    name="incentives"
                    type="number"
                    value={formData.incentives}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Arrears (₹)</Form.Label>
                  <Form.Control
                    name="arrears"
                    type="number"
                    value={formData.arrears}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Other Earnings (₹)</Form.Label>
                  <Form.Control
                    name="otherEarning"
                    type="number"
                    value={formData.otherEarning}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>PF (₹)</Form.Label>
                  <Form.Control
                    name="pf"
                    type="number"
                    value={formData.pf}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Loan (₹)</Form.Label>
                  <Form.Control
                    name="loan"
                    type="number"
                    value={formData.loan}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Other Deductions (₹)</Form.Label>
                  <Form.Control
                    name="otherDeduction"
                    type="number"
                    value={formData.otherDeduction}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Upload Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setLogo)}
                  />
                </Form.Group>
              </Col>
              {/* <Col md={6}>
                <Form.Group>
                  <Form.Label>Upload Signature</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setSignature)}
                  />
                </Form.Group>
              </Col>*/}
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Check
                  type="radio"
                  label="Show Authorized Signatory"
                  name="signatureOption"
                  id="showSign"
                  checked={showSignatureLine}
                  onChange={() => setShowSignatureLine(true)}
                />
                <Form.Check
                  type="radio"
                  label="Hide Authorized Signatory"
                  name="signatureOption"
                  id="hideSign"
                  checked={!showSignatureLine}
                  onChange={() => setShowSignatureLine(false)}
                />
              </Col>
            </Row>

            <Button
              className="mt-3"
              variant="success"
              onClick={handleCalculate}
            >
              Preview Salary Slip
            </Button>
          </Form>

          {calc && (
            <div
              id="pdf-content"
              className="p-4 border mt-4"
              style={{ fontFamily: "Arial", fontSize: "14px" }}
            >
              {logo && (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ maxHeight: "80px", marginBottom: "10px" }}
                  />
                </div>
              )}

              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                <p style={{ marginTop: 0 }}>{formData.branchAddress}</p>
              </div>

              <table style={{ width: "100%", margin: "10px 0" }}>
                <tbody>
                  <tr>
                    <td>
                      <strong>Employee Name:</strong>
                    </td>
                    <td>{formData.employeeName}</td>
                    <td>
                      <strong>Employee ID:</strong>
                    </td>
                    <td>{formData.employeeId}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email:</strong>
                    </td>
                    <td>{formData.email}</td>
                    <td>
                      <strong>ESIC No:</strong>
                    </td>
                    <td>{formData.esicNo}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Designation:</strong>
                    </td>
                    <td>{formData.designation}</td>
                    <td>
                      <strong>Department:</strong>
                    </td>
                    <td>{formData.department}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Branch:</strong>
                    </td>
                    <td>{formData.branch}</td>
                    <td>
                      <strong>Paid Days:</strong>
                    </td>
                    <td>{calc.workingDays.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "10px",
                }}
                border="1"
              >
                <thead>
                  <tr style={{ background: "#f1f1f1" }}>
                    <th
                      colSpan="3"
                      style={{ textAlign: "center", padding: "8px" }}
                    >
                      EARNINGS
                    </th>
                    <th
                      colSpan="3"
                      style={{ textAlign: "center", padding: "8px" }}
                    >
                      DEDUCTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "6px" }}>Basic</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.basic.toFixed(2)}
                    </td>
                    <td style={{ padding: "6px" }}>E.S.I.C</td>
                    <td style={{ padding: "6px" }}>1.75%</td>
                    <td style={{ padding: "6px" }}>₹{calc.esic.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>OT - Amount</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.ot.toFixed(2)}
                    </td>
                    <td style={{ padding: "6px" }}>P. Fund</td>
                    <td style={{ padding: "6px" }}>12.00%</td>
                    <td style={{ padding: "6px" }}>₹{calc.pf.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>HRA</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.hra.toFixed(2)}
                    </td>
                    <td style={{ padding: "6px" }}>Prof. Tax</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.pt.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>Education</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      -
                    </td>
                    <td style={{ padding: "6px" }}>Loan (Advance)</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.loan.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>DA</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      0.00
                    </td>
                    <td style={{ padding: "6px" }}>Income Tax</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      -
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>CCA</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      0.00
                    </td>
                    <td style={{ padding: "6px" }}>Leave Deduction</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.otherDeduction.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>Special</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.special.toFixed(2)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px" }}>Conveyance</td>
                    <td colSpan={2} style={{ padding: "6px" }}>
                      ₹{calc.conveyance.toFixed(2)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr
                    style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}
                  >
                    <td colSpan={3} style={{ padding: "6px" }}>
                      Gross Earnings : ₹{calc.totalEarnings.toFixed(2)}
                    </td>
                    <td colSpan={3} style={{ padding: "6px" }}>
                      Total Deductions : ₹{calc.totalDeductions.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      Net Salary : ₹{calc.net.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
<div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
  <h6 style={{ margin: 0, marginRight: "8px" }}>In words:</h6>
  <p
    style={{
      margin: 0,
      fontWeight: "bold",
      fontSize: "13px",
    }}
  >
    ({calc.netWords})
  </p>
</div>

              {showSignatureLine && (
                <div style={{ marginTop: "40px", textAlign: "right" }}>
                  {signature ? (
                    <>
                      <img
                        src={signature}
                        alt="Signature"
                        style={{ maxHeight: "60px" }}
                      />
                      <p>Authorized Signatory</p>
                    </>
                  ) : (
                    <>
                      <div
                       style={{
                      //   borderBottom: "1px solid #000",
                        width: "200px",
                         height: "40px",
                         marginLeft: "auto",
                       }}
                      ></div>
                      <p style={{ marginTop: "5px" }}>Authorized Signatory</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {calc && (
            <Button variant="primary" onClick={handleGeneratePdf}>
              Download PDF
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SalarySlipGenerator;
