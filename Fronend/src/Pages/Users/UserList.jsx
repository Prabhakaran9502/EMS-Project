import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../Api/userApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "./Users.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFileText } from "react-icons/fi";
import { FiEye, FiUserPlus } from "react-icons/fi";
import Modal from "../../Components/Common/Modal";
import AssignEmployeeForm from "./AssignEmployeeForm";
import ViewEmployee from "./ViewEmployee";

export default function UserList() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");


    const [openAssign, setOpenAssign] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [openView, setOpenView] = useState(false);
    const [viewUser, setViewUser] = useState(null);


    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!openAssign) {
            fetchUsers();
        }
    }, [openAssign]);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.UserId !== id));
        } catch {
            alert("Delete failed");
        }
    };

    const filteredUsers = users.filter(user =>
        user.UserName.toLowerCase().includes(search.toLowerCase()) ||
        user.Email.toLowerCase().includes(search.toLowerCase()) ||
        user.UserId.toString().includes(search)
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortField) return 0;

        let valueA = a[sortField].toLowerCase();
        let valueB = b[sortField].toLowerCase();

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });



    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleExportExcel = () => {
        const exportData = filteredUsers.map(user => ({
            UserId: user.UserId,
            "User Name": user.UserName,
            Email: user.Email
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        XLSX.writeFile(
            workbook,
            `User_List_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
    };


    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Users List", 14, 15);

        const tableColumn = ["ID", "User Name", "Email"];
        const tableRows = filteredUsers.map(user => [
            user.UserId,
            user.UserName,
            user.Email
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 22,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] } // same blue as Employees
        });

        doc.save(
            `User_List_${new Date().toISOString().slice(0, 10)}.pdf`
        );
    };


    return (
        <div className="user-layout">
            <main className="user-main">
                <h2>Users List</h2>

                <div className="table-header">
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="UserName">User Name</option>
                            <option value="Email">Email</option>
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
                </div>


                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>
                                        Loading users...
                                    </td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td colSpan="4" cstyle={{ textAlign: "center", color: "red" }}>
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && currentUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>
                                        No users found
                                    </td>
                                </tr>
                            )}

                            {!loading && !error &&
                                currentUsers.map(user => (
                                    <tr key={user.UserId}>
                                        <td data-label="ID">{user.UserId}</td>
                                        <td data-label="User Name">{user.UserName}</td>
                                        <td data-label="Email">{user.Email}</td>
                                        <td data-label="Actions" className="actions">

                                            {user.IsEmployee === 0 && (
                                                <button
                                                    className="btn-assign"
                                                    title="Assign Employee"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setOpenAssign(true);
                                                    }}
                                                >
                                                    <FiUserPlus />
                                                </button>

                                            )}

                                            {user.IsEmployee === 1 && (
                                                <button
                                                    className="btn-view"
                                                    title="View Employee"
                                                    onClick={() => {
                                                        setViewUser(user);
                                                        setOpenView(true);
                                                    }}
                                                >
                                                    <FiEye />
                                                </button>

                                            )}

                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(user.UserId)}
                                                title="Delete User"
                                            >
                                                <FiTrash2 />
                                            </button>

                                        </td>

                                    </tr>
                                ))}
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
                                setCurrentPage(1);
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

                        {pages.map(page => (
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

                <Modal
                    isOpen={openAssign}
                    onClose={() => setOpenAssign(false)}
                    title="Add Employee"
                >
                    <AssignEmployeeForm
                        user={selectedUser}
                        onClose={() => setOpenAssign(false)}
                    />
                </Modal>

                <Modal
                    isOpen={openView}
                    onClose={() => setOpenView(false)}
                    title="Employee Details"
                >
                    <ViewEmployee
                        userId={viewUser?.UserId}
                        onClose={() => setOpenView(false)}
                    />
                </Modal>


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
