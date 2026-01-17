import apiInstance, { setTokens, clearTokens, setUser } from './index';

export const login = async (email, password) => {
    const response = await apiInstance.post('/auth/login', {
        email,
        password,
    });

    const { accessToken, user } = response.data.data;

    setTokens(accessToken);
    setUser(user);

    return response.data;
};

export const signup = async (name, email, password) => {
    const response = await apiInstance.post('/auth/signup', {
        name,
        email,
        password,
    });

    return response.data;
};

export const logout = async () => {
    try {
        await apiInstance.post('/auth/logout');
        clearTokens();
        window.location.href = '/login';
    } catch (error) {
        clearTokens();
        window.location.href = '/login';
    }
};

export const getCurrentUser = async () => {
    const response = await apiInstance.get('/auth/me');
    return response.data;
};
