import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Container,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both Email and password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await login(email, password)
      showToast('Login successful!', 'success')

      const loggedUser = res?.data?.user || res?.user
      const userRole = loggedUser?.role
      const from = location.state?.from?.pathname

      if (from) {
        navigate(from, { replace: true })
      } else if (userRole === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true })
      } else if (userRole === 'STUDENT') {
        navigate('/student/dashboard', { replace: true })
      } else {
        navigate('/admin/dashboard', { replace: true })
      }
    } catch (err) {
      setError(
        err?.message ||
          'Invalid credentials. Please verify your input and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#ffffff',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ maxWidth: 440 }}>
        <Stack spacing={3} alignItems="center">
          {/* SMIT Logo & Portal Title */}
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{
                height: 64,
                width: 'auto',
                objectFit: 'contain',
                mx: 'auto',
                display: 'block',
                mb: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '1.1rem',
                letterSpacing: '-0.01em',
              }}
            >
              Student Portal
            </Typography>
          </Box>

          {/* Saylani Form Card with Light Box Shadow */}
          <Card
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 0.8,
                  fontSize: '1.15rem',
                }}
              >
                Login
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  mb: 3,
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                }}
              >
                Kindly provide the CNIC number and password used during SMIT
                course registration.
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2.5, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  {/* CNIC / Email Field */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#334155',
                        fontSize: '0.85rem',
                        mb: 0.8,
                      }}
                    >
                      CNIC *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter CNIC number or email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#ffffff',
                          fontSize: '0.9rem',
                          '& fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#94a3b8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#255293',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#334155',
                        fontSize: '0.85rem',
                        mb: 0.8,
                      }}
                    >
                      Password *
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#ffffff',
                          fontSize: '0.9rem',
                          '& fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#94a3b8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#255293',
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff
                                  fontSize="small"
                                  sx={{ color: '#64748b' }}
                                />
                              ) : (
                                <Visibility
                                  fontSize="small"
                                  sx={{ color: '#64748b' }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Primary Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : null
                    }
                    sx={{
                      bgcolor: '#255293',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      py: 1.3,
                      borderRadius: 2,
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 6px rgba(37, 82, 147, 0.2)',
                      '&:hover': {
                        bgcolor: '#1d437d',
                        boxShadow: '0 4px 10px rgba(29, 67, 125, 0.3)',
                      },
                    }}
                  >
                    {loading ? 'Logging in...' : 'LOGIN'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
