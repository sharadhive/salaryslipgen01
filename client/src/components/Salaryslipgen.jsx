import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import html2pdf from "html2pdf.js";

const SalarySlipGenerator = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    email: "",
    branch: "",
    branchAddress: "",
    monthlySalary: "",
    ot: 0,
    loan: 0,
    incomeTax: 0,
    leaveDeduction: 0,
    designation: "",
    department: "",
    fromDate: "",
    toDate: "",
  });

  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [calc, setCalc] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCalculate = () => {
    const salary = parseFloat(formData.monthlySalary) || 0;
    const basic = salary * 0.5;
    const hra = salary * 0.15;
    const conveyance = salary * 0.25;
    const education = 0;
    const da = 0;
    const cca = 0;
    const special = salary - (basic + hra + conveyance + education + da + cca);
    const ot = parseFloat(formData.ot) || 0;

    const grossEarnings =
      basic + hra + education + da + cca + special + conveyance + ot;

    const esic = +(grossEarnings * 0.0175).toFixed(2);
    const pf = +(grossEarnings * 0.12).toFixed(2);
    const profTax = 200;
    const loan = parseFloat(formData.loan) || 0;
    const incomeTax = parseFloat(formData.incomeTax) || 0;
    const leaveDeduction = parseFloat(formData.leaveDeduction) || 0;

    const totalDeductions =
      esic + pf + profTax + loan + incomeTax + leaveDeduction;
    const netSalary = grossEarnings - totalDeductions;

    setCalc({
      basic,
      hra,
      education,
      da,
      cca,
      special,
      conveyance,
      ot,
      grossEarnings,
      esic,
      pf,
      profTax,
      loan,
      incomeTax,
      leaveDeduction,
      totalDeductions,
      netSalary,
    });
  };

  const handleGeneratePdf = () => {
    const element = document.getElementById("salary-slip-preview");
    html2pdf().from(element).save("SalarySlip.pdf");
  };

  return (
    <div className="container py-4">
      <Button onClick={() => setShow(true)}>Generate Salary Slip</Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Salary Slip Generator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Label>Employee Name</Form.Label>
                <Form.Control name="employeeName" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Employee ID</Form.Label>
                <Form.Control name="employeeId" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label>Monthly Salary</Form.Label>
                <Form.Control
                  name="monthlySalary"
                  type="number"
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Label>OT</Form.Label>
                <Form.Control name="ot" type="number" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Loan</Form.Label>
                <Form.Control
                  name="loan"
                  type="number"
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Label>Income Tax</Form.Label>
                <Form.Control
                  name="incomeTax"
                  type="number"
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Label>Leave Deduction</Form.Label>
                <Form.Control
                  name="leaveDeduction"
                  type="number"
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Label>Upload Logo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setLogo)}
                />
              </Col>
            </Row>
            <Button
              className="mt-3"
              variant="success"
              onClick={handleCalculate}
            >
              Preview
            </Button>
          </Form>

          {calc && (
            <div
              id="salary-slip-preview"
              className="mt-4 p-4 border"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {logo && (
                <div className="text-center mb-3">
                  <img src={logo} alt="Logo" height={70} />
                </div>
              )}
              <h4 className="text-center mb-3">Salary Slip</h4>
              <table
                className="table table-bordered text-center"
                style={{ borderCollapse: "collapse", fontSize: "14px" }}
              >
                <thead className="table-light">
                  <tr>
                    <th colSpan="2">EARNINGS</th>
                    <th colSpan="2">DEDUCTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic</td>
                    <td>{calc.basic.toFixed(2)}</td>
                    <td>ESIC (1.75%)</td>
                    <td>{calc.esic.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>HRA</td>
                    <td>{calc.hra.toFixed(2)}</td>
                    <td>PF (12%)</td>
                    <td>{calc.pf.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Education</td>
                    <td>{calc.education.toFixed(2)}</td>
                    <td>Prof. Tax</td>
                    <td>{calc.profTax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>DA</td>
                    <td>{calc.da.toFixed(2)}</td>
                    <td>Loan (Advance)</td>
                    <td>{calc.loan.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>CCA</td>
                    <td>{calc.cca.toFixed(2)}</td>
                    <td>Income Tax</td>
                    <td>{calc.incomeTax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Special</td>
                    <td>{calc.special.toFixed(2)}</td>
                    <td>Leave Deduction</td>
                    <td>{calc.leaveDeduction.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Conveyance</td>
                    <td>{calc.conveyance.toFixed(2)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>OT</td>
                    <td>{calc.ot.toFixed(2)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#f1f1f1" }}
                  >
                    <td>Gross Earnings</td>
                    <td>{calc.grossEarnings.toFixed(2)}</td>
                    <td>Total Deductions</td>
                    <td>{calc.totalDeductions.toFixed(2)}</td>
                  </tr>
                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#dff0d8" }}
                  >
                    <td colSpan="4" className="text-center">
                      Net Salary: ₹{calc.netSalary.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              {signature && (
                <div style={{ marginTop: "50px", textAlign: "right" }}>
                  <img
                    src={signature}
                    alt="Signature"
                    style={{ maxHeight: "60px" }}
                  />
                  <p>Authorized Signatory</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          {calc && (
            <Button variant="primary" onClick={handleGeneratePdf}>
              Download PDF
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalarySlipGenerator;
