import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import html2pdf from "html2pdf.js";

const branchAddresses = {
  mohali: 'SCF 62, Third Floor, Phase 7, Sector 61, Sahibzada Ajit Singh Nagar, Punjab, Mohali, India 160062',
  thane: '201, Anant Laxmi Chambers, Dada Patil Marg, opp. Waman Hari Pethe Jewellers, Thane, Maharashtra - 400602',
  vashi: 'Corporate Wing, F-185(A, behind Inorbit Mall, Sector 30, Vashi, Navi Mumbai - 400703',
  borivali: 'A/401, Court Chamber, Opp. Moksh Plaza, S.V. Road, Borivali (W) - 400092'
  };


const SalarySlipGenerator = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    email: "",
    branch: "",
    address: "",
    monthlySalary: "",
    absentDays: 0,
    halfDays: 0,
    ot: 0,
    incentives: 0,
    arrears: 0,
    otherEarning: 0,
    otherDeduction: 0,
  });
  const [signature, setSignature] = useState(null);
  const [logo, setLogo] = useState(null);
  const [calc, setCalc] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "branch") {
      newFormData.address = branchAddresses[value] || "";
    }

    setFormData(newFormData);
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
    const salary = parseFloat(formData.monthlySalary) || 0;
    const absentDays = parseFloat(formData.absentDays) || 0;
    const halfDays = parseFloat(formData.halfDays) || 0;

    const salaryPerDay = salary / 30;
    const halfDayDeduction = (salaryPerDay / 2) * halfDays;
    const absentDeduction = salaryPerDay * absentDays;
    const deductedSalary = salary - absentDeduction - halfDayDeduction;

    const basic = deductedSalary * 0.5;
    const hra = deductedSalary * 0.25;
    const special = deductedSalary * 0.125;
    const conveyance = deductedSalary * 0.125;

    const ot = parseFloat(formData.ot) || 0;
    const incentives = parseFloat(formData.incentives) || 0;
    const arrears = parseFloat(formData.arrears) || 0;
    const otherEarning = parseFloat(formData.otherEarning) || 0;

    const totalEarnings =
      basic + hra + special + conveyance + ot + incentives + arrears + otherEarning;

    const esic = salary < 21000 ? deductedSalary * 0.0175 : 0;
    const mlwf = 0;
    const pt = 200;
    const otherDeduction = parseFloat(formData.otherDeduction) || 0;

    const totalDeductions = esic + mlwf + pt + otherDeduction;
    const net = totalEarnings - totalDeductions;

    setCalc({
      salaryPerDay,
      halfDayDeduction,
      absentDeduction,
      deductedSalary,
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
      mlwf,
      pt,
      otherDeduction,
      totalDeductions,
      net,
    });
  };

  const handleGeneratePdf = () => {
    const element = document.getElementById("pdf-content");
    html2pdf()
      .set({
        margin: 0.5,
        filename: `${formData.employeeName}_SalarySlip.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Generate Salary Slip
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Salary Slip Generator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Employee ID</Form.Label>
                  <Form.Control
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
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
              <Col>
                <Form.Group>
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    as="select"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    {Object.keys(branchAddresses).map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
                <Form.Group>
                  <Form.Label>Upload Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setLogo)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Upload Signature</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setSignature)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button className="mt-3" variant="success" onClick={handleCalculate}>
              Preview Salary Slip
            </Button>
          </Form>

          {calc && (
            <div
              id="pdf-content"
              className="mt-4 p-4"
              style={{
                border: "1px solid #ccc",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
              }}
            >
              {logo && (
                <div style={{ textAlign: "center" }}>
                  <img src={logo} alt="Logo" style={{ maxHeight: "80px" }} />
                </div>
              )}

              <h4 className="text-center mt-2 mb-3">Salary Slip</h4>
              <p><strong>Employee Name:</strong> {formData.employeeName}</p>
              <p><strong>Employee ID:</strong> {formData.employeeId}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Branch:</strong> {formData.branch}</p>
              <p><strong>Branch Address:</strong> {formData.address}</p>
              <p><strong>Monthly Salary:</strong> ₹{formData.monthlySalary}</p>

              <hr />
              <h5 className="mt-3">Earnings</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>Basic</td><td>₹{calc.basic.toFixed(2)}</td></tr>
                  <tr><td>HRA</td><td>₹{calc.hra.toFixed(2)}</td></tr>
                  <tr><td>Special Allowance</td><td>₹{calc.special.toFixed(2)}</td></tr>
                  <tr><td>Conveyance</td><td>₹{calc.conveyance.toFixed(2)}</td></tr>
                  <tr><td>OT</td><td>₹{calc.ot.toFixed(2)}</td></tr>
                  <tr><td>Incentives</td><td>₹{calc.incentives.toFixed(2)}</td></tr>
                  <tr><td>Arrears</td><td>₹{calc.arrears.toFixed(2)}</td></tr>
                  <tr><td>Other Earnings</td><td>₹{calc.otherEarning.toFixed(2)}</td></tr>
                  <tr><th>Total Earnings</th><th>₹{calc.totalEarnings.toFixed(2)}</th></tr>
                </tbody>
              </table>

              <h5>Deductions</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>ESIC</td><td>₹{calc.esic.toFixed(2)}</td></tr>
                  <tr><td>MLWF</td><td>₹{calc.mlwf.toFixed(2)}</td></tr>
                  <tr><td>Professional Tax</td><td>₹{calc.pt.toFixed(2)}</td></tr>
                  <tr><td>Other Deductions</td><td>₹{calc.otherDeduction.toFixed(2)}</td></tr>
                  <tr><th>Total Deductions</th><th>₹{calc.totalDeductions.toFixed(2)}</th></tr>
                </tbody>
              </table>

              <h4>Net Salary: ₹{calc.net.toFixed(2)}</h4>

              {signature && (
                <div style={{ marginTop: "50px", textAlign: "right" }}>
                  <img src={signature} alt="Signature" style={{ maxHeight: "60px" }} />
                  <p>Authorized Signatory</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
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
