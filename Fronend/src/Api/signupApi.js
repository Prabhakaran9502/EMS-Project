import axiosInstance from "./axiosInstance";

export const getEmails = (email) =>
    axiosInstance.get("/users/check-email",
        {
            params: { email }
        });


export const addUser = (data) => {
    return axiosInstance.post(
        "/users",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};


export const forgotPassword = (email) =>
    axiosInstance.post("/users/forgot-password", email,
        {
            headers: { "Content-Type": "application/json" }
        });
