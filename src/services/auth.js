import { jwtDecode } from 'jwt-decode'

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function logout() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  const token = getToken();
  return !!token;
}

export function getUser() {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error('JWT inválido', error);
    logout();
    return null;
  }
}

export function getRole() {
    const user = getUser();

    return user?.Role || null;
}
