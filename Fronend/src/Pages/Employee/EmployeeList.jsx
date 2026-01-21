import "./EmployeePage.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiFileText } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getEmployees, deleteEmployee, getMasterData } from "../../Api/employeeApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function EmployeePage() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [departments, setDepartments] = useState([]);

    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await getEmployees();
            // console.log(res.data);
            setEmployees(res.data);
        } catch (err) {
            setError("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await getMasterData();

            // Assuming Table = Departments
            setDepartments(res.data.Table || []);
        } catch (err) {
            console.error("Failed to load departments");
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete employee?")) return;

        try {
            await deleteEmployee(id);
            setEmployees((prev) => prev.filter(emp => emp.id !== id));
        } catch {
            alert("Failed to delete");
        }
    };

    const filteredEmployees = employees
        .filter(emp =>
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.id.toString().includes(search) ||
            emp.email.toLowerCase().toString().includes(search.toLowerCase()) ||
            emp.phone.toLowerCase().toString().includes(search.toLowerCase())
        )
        .filter(emp =>
            departmentFilter ? emp.department === departmentFilter : true
        )
        .filter(emp =>
            statusFilter !== ""
                ? emp.status === (statusFilter === "true")
                : true
        );

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        if (!sortField) return 0;

        let valueA = a[sortField];
        let valueB = b[sortField];

        if (typeof valueA === "string") {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });


    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);


    const handleExportExcel = () => {
        // Export only filtered employees (respects search & filters)
        const exportData = filteredEmployees.map(emp => ({
            EmployeeId: emp.id,
            "Employee Name": emp.name,
            Email: emp.email,
            Phone: emp.phone,
            Gender: emp.gender,
            Department: emp.department,
            Designation: emp.designation,
            Salary: emp.salary,
            "Employment Type": emp.employmentType,
            Status: emp.status == true ? 'Active' : 'Inactive',
            Location: emp.location,
            Address: emp.address
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");



        XLSX.writeFile(
            workbook,
            `Employee_List_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
    };

    const handleExportPDF = () => {
        const doc = new jsPDF("landscape"); // landscape fits table better

        doc.setFontSize(16);
        doc.text("Employee List", 14, 15);

        const tableColumn = [
            "Id",
            "Name",
            "Email",
            "Phone",
            "Gender",
            "Department",
            "Designation",
            "Salary",
            "Employement Type",
            "Status",
            "Location",
            "Address"
        ];

        const tableRows = filteredEmployees.map(emp => [
            emp.id,
            emp.name,
            emp.email,
            emp.phone,
            emp.gender,
            emp.department,
            emp.designation,
            emp.salary,
            emp.employmentType,
            emp.status == true ? 'Active' : 'Inactive',
            emp.location,
            emp.address
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 22,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] } // professional blue
        });

        doc.save(
            `Employee_List_${new Date().toISOString().slice(0, 10)}.pdf`
        );
    };


    return (
        <div className="employee-layout">

            <main className="employee-main">
                <h2>Employees List</h2>


                <div className="table-header">
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                        <select
                            value={departmentFilter}
                            onChange={(e) => {
                                setDepartmentFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Departments</option>

                            {departments.map(dep => (
                                <option
                                    key={dep.Department_Id}
                                    value={dep.Department_Name}
                                >
                                    {dep.Department_Name}
                                </option>
                            ))}
                        </select>


                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="name">Name</option>
                            <option value="salary">Salary</option>
                            <option value="department">Department</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>

                        <button
                            className="clear-btn"
                            onClick={() => {
                                setSearch("");
                                setDepartmentFilter("");
                                setStatusFilter("");
                                setSortField("");
                                setSortOrder("asc");
                                setCurrentPage(1);

                            }}
                        >
                            Clear
                        </button>

                    </div>
                </div>

                <div className="export-actions">
                    <ExportDropdown
                        handleExportExcel={handleExportExcel}
                        handleExportPDF={handleExportPDF}
                    />

                    <button
                        className="add-employee-btn"
                        onClick={() => navigate("/employees/add")}
                    >
                        + Add Employee
                    </button>
                </div>


                {/* Employee Table */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                {/* <th>Designation</th> */}
                                <th>Salary</th>
                                {/* <th>Type</th> */}
                                <th>Status</th>
                                {/* <th>Role</th> */}
                                {/* <th>Location</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        Loading employees...
                                    </td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && currentEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No employees found
                                    </td>
                                </tr>
                            )}

                            {!loading && !error &&
                                currentEmployees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td data-label="Name">{emp.name}</td>
                                        <td data-label="Email">{emp.email}</td>
                                        <td data-label="Phone">{emp.phone}</td>
                                        <td data-label="Department">{emp.department}</td>
                                        <td data-label="Salary">{emp.salary}</td>
                                        <td data-label="Status">
                                            {emp.status ? "Active" : "Inactive"}
                                        </td>
                                        <td data-label="Actions" className="actions-cell">
                                            <button
                                                onClick={() => navigate(`/employees/edit/${emp.id}`)}
                                                title="Edit Employee"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                title="Delete Employee"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>


                    </table>
                </div>

                <div className="pagination-wrapper">
                    <div className="rows-per-page">
                        <label>Rows per page:</label>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1); // reset page
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>

                        {pages.map((page) => (
                            <button
                                key={page}
                                className={currentPage === page ? "active-page" : ""}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>




            </main>
        </div>
    );
}


function ExportDropdown({ handleExportExcel, handleExportPDF }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="export-dropdown">
            <button
                className="export-main-btn"
                onClick={() => setOpen(!open)}
            >
                <FiDownload />
                Export
            </button>

            {open && (
                <div className="export-menu">
                    <button onClick={() => { handleExportExcel(); setOpen(false); }}>
                        <FiFileText /> Export Excel
                    </button>
                    <button onClick={() => { handleExportPDF(); setOpen(false); }}>
                        <FiFileText /> Export PDF
                    </button>
                </div>
            )}
        </div>
    );
}