
import axiosInstance from "./axiosInstance";

export const loginUser = (data) =>
    axiosInstance.post("/users/login", data);

export const fetchMenu = (roleId) =>
    axiosInstance.get("/users/fetchRoleMenu", { params: { roleId } });

