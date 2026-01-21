import axiosInstance from "./axiosInstance";

export const getMasterData = () => {
    return axiosInstance.get("/employees/getMasterData");
};

export const getEmployees = () => {
    return axiosInstance.get("/employees");
};

export const getEmployeeById = (id) => {
    return axiosInstance.get(`/employees/${id}`);
};

export const addEmployee = (data) => {
    return axiosInstance.post(
        "/employees",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};

export const updateEmployee = (id, data) => {
    return axiosInstance.put(
        `/employees/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};

export const deleteEmployee = (id) => {
    return axiosInstance.delete(`/employees/${id}`);
};

export const getEmails = (email) =>
    axiosInstance.get("/users/check-email",
        {
            params: { email }
        });