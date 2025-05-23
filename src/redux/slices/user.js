import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../tools/axios.js'

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/user/auth/login', params)
        return response.data
    } catch (error) {
        if (!error.response) {
            throw error
        }
        return rejectWithValue(error.response.data)
    }
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/user/auth/registration', params)
        return response.data
    } catch (error) {
        if (!error.response) {
            throw error
        }
        return rejectWithValue(error.response.data)
    }
})

export const fetchUpdateProfile = createAsyncThunk('auth/fetchUpdateProfile', async (params, { rejectWithValue }) => {
    try {
        const response = await axios.patch('api/user/me/update', params)
        return response.data
    } catch (error) {
        if (!error.response) {
            throw error
        }
        return rejectWithValue(error.response.data)
    }
})

export const fetchAllUsers = createAsyncThunk("auth/fetchAllUsers", async () => {
    const { data } = await axios.get(`/api/user/all`);
    return data;
}
)

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (_, { rejectWithValue }) => {
    console.log('🔄 Fetching current user data...')
    
    // Check if token exists
    const token = window.localStorage.getItem('token')
    if (!token) {
        console.log('⚠️ No token found in localStorage')
    } else {
        console.log('🔑 Token found in localStorage:', token?.substring(0, 15) + '...')
    }
    
    try {
        console.log('🔍 Sending request to /api/user/me')
        const { data } = await axios.get('/api/user/me')
        console.log('✅ Received user data:', data?.username || data?.email || 'Unknown user')
        return data
    } catch (error) {
        console.log('❌ Error fetching user data:', error.message)
        console.log('Response status:', error.response?.status)
        console.log('Response data:', error.response?.data)
        
        if (!error.response) {
            throw error
        }
        return rejectWithValue(error.response?.data || 'Authentication failed')
    }
})


const initialState = {
    items: [],
    data: null,
    status: 'idle',
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
            state.status = 'loaded'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading'
                state.data = null
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.data = action.payload
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'error'
                state.data = null
            })

            .addCase(fetchLogin.pending, (state) => {
                state.status = 'loading'
                state.error = ''
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.data = action.payload
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })


            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading'
                state.error = ''
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.data = action.payload
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.status = 'error'
                state.error = action.payload
            })

            .addCase(fetchUpdateProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUpdateProfile.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchUpdateProfile.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message; 
            })


            .addCase(fetchAllUsers.pending, (state) => {
                state.status = 'loading';
                state.items = [];
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.items = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state) => {
                state.status = 'error';
                state.items = [];
            })
    }
})

export const selectIsAuth = (state) => Boolean(state.user.data)

export const { logout } = userSlice.actions

export const userReducer = userSlice.reducer