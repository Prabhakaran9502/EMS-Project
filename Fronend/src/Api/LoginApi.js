
import axiosInstance from "./axiosInstance";

export const loginUser = (data) =>
    axiosInstance.post("/users/login", data);