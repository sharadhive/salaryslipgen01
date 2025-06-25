import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
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
    monthYear: "",
  });

  const [signature, setSignature] = useState(null);
  const [logo, setLogo] = useState(null);
  const [calc, setCalc] = useState(null);

  const branchAddresses = {
    mohali:
      "SCF 62, Third Floor, Phase 7, Sector 61, Sahibzada Ajit Singh Nagar, Punjab, Mohali, India 160062",
    thane:
      "201, Anant Laxmi Chambers, Dada Patil Marg, opp. Waman Hari Pethe Jewellers, Thane, Maharashtra - 400602",
    vashi:
      "Corporate Wing, F-185(A, behind Inorbit Mall, Sector 30, Vashi, Navi Mumbai - 400703",
    borivali:
      "A/401, Court Chamber, Opp. Moksh Plaza, S.V. Road, Borivali (W) - 400092",
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
    const pf = parseFloat(formData.pf) || 0;
    const loan = parseFloat(formData.loan) || 0;

    const totalDeductions = esic + mlwf + pt + otherDeduction + pf + loan;
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
      pf,
      loan,
      totalDeductions,
      net,
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

      <Modal show={show} onHide={handleClose} size="lg">
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
                  <Form.Label>Month & Year</Form.Label>
                  <Form.Control
                    name="monthYear"
                    type="month"
                    value={formData.monthYear}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    as="select"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    {Object.keys(branchAddresses).map((branchName) => (
                      <option key={branchName} value={branchName}>
                        {branchName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Upload Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setLogo)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
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
            <div id="pdf-content" className="mt-4 p-4 border">
              {logo && (
                <div style={{ textAlign: "center" }}>
                  <img src={logo} alt="Logo" style={{ maxHeight: "80px" }} />
                </div>
              )}
              <h4 className="text-center mt-2">Salary Slip</h4>
              <p><strong>Name:</strong> {formData.employeeName}</p>
              <p><strong>Employee ID:</strong> {formData.employeeId}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Month - Year:</strong> {formData.monthYear}</p>
              <p><strong>Designation:</strong> {formData.designation}</p>
              <p><strong>Department:</strong> {formData.department}</p>
              <p><strong>Branch:</strong> {formData.branch}</p>
              <p><strong>Branch Address:</strong> {formData.branchAddress}</p>

              <hr />
              <h5>Earnings</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>Basic </td><td>₹{calc.basic.toFixed(2)}</td></tr>
                  <tr><td>HRA </td><td>₹{calc.hra.toFixed(2)}</td></tr>
                  <tr><td>Special Allowance</td><td>₹{calc.special.toFixed(2)}</td></tr>
                  <tr><td>Conveyance </td><td>₹{calc.conveyance.toFixed(2)}</td></tr>
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
                  <tr><td>ESIC {formData.monthlySalary < 21000 ? "(1.75%)" : "(N/A)"}</td><td>₹{calc.esic.toFixed(2)}</td></tr>
                  <tr><td>PF</td><td>₹{calc.pf.toFixed(2)}</td></tr>
                  <tr><td>Loan</td><td>₹{calc.loan.toFixed(2)}</td></tr>
                  <tr><td>Professional Tax</td><td>₹{calc.pt.toFixed(2)}</td></tr>
                  <tr><td>Other Deductions</td><td>₹{calc.otherDeduction.toFixed(2)}</td></tr>
                  <tr><td>MLWF</td><td>₹{calc.mlwf.toFixed(2)}</td></tr>
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
