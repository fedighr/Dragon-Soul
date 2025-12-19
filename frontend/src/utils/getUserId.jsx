import { jwtDecode } from 'jwt-decode';
import React from 'react';

export const getUserId = () => {
  try {
    const token = localStorage.getItem('access');
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    return null;
  }
};