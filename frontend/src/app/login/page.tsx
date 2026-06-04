'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Stack,
    Divider,
    Grid,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock,
    Person,
    CheckCircle,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface FormState {
    username: string;
    password: string;
}

interface ErrorState {
    username?: string;
    password?: string;
    submit?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState<FormState>({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState<ErrorState>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: ErrorState = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof ErrorState]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await login(formData.username, formData.password);
            setIsSuccess(true);
        } catch (error: unknown) {
            console.error("Error in submission", error);
            const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
            setErrors({ submit: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
            {/* Left Side - Image / Branding */}
            <Box sx={{ 
                flex: 1,
                display: { xs: 'none', md: 'block' },
                background: 'linear-gradient(135deg, #0062FE 0%, #003db3 100%)',
                position: 'relative'
            }}>
                <Box sx={{ 
                    position: 'absolute', inset: 0, 
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 4, lg: 10 }
                }}>
                    <Typography variant="h2" fontWeight={800} color="white" mb={3} sx={{ lineHeight: 1.2 }}>
                        Welcome back to EduPath AI.
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.8)" fontWeight={400} sx={{ lineHeight: 1.6 }}>
                        Continue your journey towards a data-backed career path. Join thousands of students building their future with us.
                    </Typography>
                </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 8 } }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    {/* Header */}
                    <Stack spacing={1} mb={5}>
                        <Box sx={{ width: 40, height: 40, bgcolor: '#0062FE', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ width: 20, height: 20, border: '2px solid white', borderRadius: '2px', transform: 'rotate(45deg)' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={800} color="#1A1A1A">
                            Log in
                        </Typography>
                        <Typography variant="body1" color="#64748B">
                            Please enter your details to sign in.
                        </Typography>
                    </Stack>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                error={!!errors.username}
                                helperText={errors.username}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94A3B8' }} /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />

                            {errors.submit && <Alert severity="error" icon={<ErrorIcon />} sx={{ borderRadius: 2 }}>{errors.submit}</Alert>}
                            {isSuccess && <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: 2 }}>Login successful! Redirecting...</Alert>}

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                disabled={isLoading || isSuccess}
                                sx={{
                                    py: 1.5,
                                    bgcolor: '#0062FE',
                                    color: 'white',
                                    borderRadius: '50px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:hover': { bgcolor: '#0050d1' },
                                    boxShadow: 'none'
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 4 }}>
                        <Typography variant="body2" color="#94A3B8">OR</Typography>
                    </Divider>

                    <Typography variant="body2" color="#64748B" textAlign="center">
                        Don't have an account?{' '}
                        <Link href="/signup" sx={{ color: '#0062FE', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            Sign up here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Stack>
    );
}