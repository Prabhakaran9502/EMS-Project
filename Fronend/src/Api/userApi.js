import axiosInstance from "./axiosInstance";

export const getUsers = () => {
    return axiosInstance.get("/users");
};

export const deleteUser = (id) => {
    return axiosInstance.delete(`/users/${id}`);
};

export const getEmployeeDetails = (id) => {
    return axiosInstance.get(`/users/getEmployeeDetails/${id}`);
}

export const getMasterData = () => {
    return axiosInstance.get("/employees/getMasterData");
};

export const getEmployeeById = (id) => {
    return axiosInstance.get(`/employees/${id}`);
};

export const saveEmployee = (formData) => {
    return axiosInstance.post(
        "/users/AssignEmployee",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};
